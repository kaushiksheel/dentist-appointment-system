import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Assuming you have a firebase config file
import { Appointment } from "@/pages/customer/Dashboard";

export function useDoctorAppointmentsByEmail(doctorEmail: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAppointments() {
      if (!doctorEmail) {
        setError(new Error("User ID is required"));
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const appointmentsRef = collection(db, "appointments");
        const userAppointmentsQuery = query(
          appointmentsRef,
          where("doctorEmail", "==", doctorEmail),
        );

        const querySnapshot = await getDocs(userAppointmentsQuery);
        const fetchedAppointments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAppointments(fetchedAppointments as unknown as Appointment[]);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch appointments"),
        );
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [doctorEmail]);

  return { appointments, loading, error };
}
