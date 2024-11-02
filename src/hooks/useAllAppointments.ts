import { Appointment } from "@/pages/customer/Dashboard";
import { fetchAllAppointments } from "@/services/firestoreService";
import { useEffect, useState } from "react";

export function useAllAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadDentists() {
      try {
        const data = await fetchAllAppointments();
        setAppointments(data as Appointment[]);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch appointments"),
        );
      } finally {
        setLoading(false);
      }
    }

    loadDentists();
  }, []);

  return { appointments, loading, error };
}
