import { Appointment, Dentist } from "@/interfaces";
import { parseISO } from "date-fns";

export const formatAppointments = (
  appointments: Appointment[],
  dentists: Dentist[],
) => {
  return appointments.map((apt) => ({
    id: apt.id!,
    completed: apt.completed,
    date: parseISO(apt.date),
    serviceName: apt.completed
      ? "Completed Apt."
      : `${dentists.find((d) => d.id === apt.doctorId)?.fullName || "Unknown"} - ${apt.serviceName}`,
  }));
};
