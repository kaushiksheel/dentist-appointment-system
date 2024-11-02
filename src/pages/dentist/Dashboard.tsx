import { Calendar } from "@/components/Calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import { useDentists } from "@/hooks/useDentists";
import { useDoctorAppointmentsByEmail } from "@/hooks/useDoctorAppointments";
import { useServices } from "@/hooks/useServices";

import { db } from "@/lib/firebase";
import { format, isSameDay, isWeekend, parseISO } from "date-fns";
import { doc, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Appointment } from "../customer/Dashboard";

export default function AppointmentPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const { user } = useAuth();
  const { appointments: fetchedAppointments, loading: appointmentsLoading } =
    useDoctorAppointmentsByEmail(user?.email as string);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { toast } = useToast();

  const {
    dentists,
    loading: loadingDentists,
    error: dentistsError,
  } = useDentists();
  const { loading: loadingServices, error: servicesError } = useServices();

  useEffect(() => {
    if (!appointmentsLoading && fetchedAppointments) {
      setAppointments(fetchedAppointments);
    }
  }, [fetchedAppointments, appointmentsLoading]);

  const pendingAppointmentsCount = useMemo(() => {
    return appointments.filter((apt) => !apt.completed).length;
  }, [appointments]);

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedAppointment(null);
  }, []);

  const handleAppointmentClick = useCallback((appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setSelectedDate(null);
  }, []);

  const handleCloseModal = () => {
    setSelectedDate(null);
    setSelectedAppointment(null);
  };

  const handleCompleteAppointment = useCallback(
    async (appointmentId: string) => {
      try {
        const appointmentRef = doc(db, "appointments", appointmentId);
        await updateDoc(appointmentRef, { completed: true });

        setAppointments((prevAppointments) =>
          prevAppointments.map((apt) =>
            apt.id === appointmentId ? { ...apt, completed: true } : apt,
          ),
        );

        toast({
          title: "Appointment Completed",
          description: "The appointment has been marked as completed.",
        });

        handleCloseModal();
      } catch (error) {
        console.error("Error updating appointment:", error);
        toast({
          title: "Update Failed",
          description:
            "There was an error marking the appointment as completed. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  const isDateDisabled = useCallback((date: Date) => isWeekend(date), []);

  if (loadingDentists || loadingServices || appointmentsLoading) {
    return <div>Loading...</div>;
  }

  if (dentistsError || servicesError) {
    return <div>Error: {dentistsError?.message || servicesError?.message}</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <h2 className="mb-4 text-xl font-semibold">
        Pending Appointments ({pendingAppointmentsCount})
      </h2>
      <Calendar
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onDateClick={handleDateClick}
        onAppointmentClick={handleAppointmentClick}
        appointments={appointments.map((apt) => ({
          id: apt.id!,
          completed: apt.completed,
          date: parseISO(apt.date),
          serviceName: apt.completed
            ? "Completed Apt."
            : `${
                dentists.find((d) => d.id === apt.doctorId)?.fullName ||
                "Unknown"
              } - ${apt.serviceName}`,
          originalAppointment: apt,
        }))}
        isDateDisabled={isDateDisabled}
      />

      <Dialog
        open={selectedDate !== null || selectedAppointment !== null}
        onOpenChange={handleCloseModal}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedAppointment
                ? `Appointment Details for ${format(parseISO(selectedAppointment.date), "dd MMMM yyyy")}`
                : `Appointments for ${selectedDate && format(selectedDate, "dd MMMM yyyy")}`}
            </DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">
                  Patient Name: {selectedAppointment.customerName || "N/A"}
                </h3>
                <p>Service Name: {selectedAppointment.serviceName}</p>
                <p>Time: {selectedAppointment.timeSlot}</p>
                <p>
                  Status:{" "}
                  {selectedAppointment.completed ? "Completed" : "Pending"}
                </p>
                {!selectedAppointment.completed && (
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleCompleteAppointment(selectedAppointment.id!)
                    }
                  >
                    Mark as Completed
                  </Button>
                )}
              </div>
            </div>
          )}
          {selectedDate && (
            <div className="space-y-4">
              <p>Selected Date: {format(selectedDate, "dd MMMM yyyy")}</p>
              {appointments.filter((apt) =>
                isSameDay(parseISO(apt.date), selectedDate),
              ).length === 0 ? (
                <p>No appointments for this date.</p>
              ) : (
                appointments
                  .filter((apt) => isSameDay(parseISO(apt.date), selectedDate))
                  .map((apt) => (
                    <div key={apt.id} className="space-y-2">
                      <h3 className="font-semibold">
                        Patient Name: {apt.customerName || "N/A"}
                      </h3>
                      <p>Service Name: {apt.serviceName}</p>
                      <p>Time: {apt.timeSlot}</p>
                      <p>Status: {apt.completed ? "Completed" : "Pending"}</p>
                      {!apt.completed && (
                        <Button
                          className="w-full"
                          onClick={() => handleCompleteAppointment(apt.id!)}
                        >
                          Mark as Completed
                        </Button>
                      )}
                    </div>
                  ))
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
