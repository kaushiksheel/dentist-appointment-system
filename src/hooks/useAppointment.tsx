import { Appointment } from "@/interfaces";
import { format, parseISO } from "date-fns";
import { useMemo } from "react";

const TIME_SLOTS = [
  "08:30",
  "09:30",
  "10:30",
  "11:30",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:30",
];

const useAppointmentLogic = (
  selectedDate: Date | null,
  selectedDoctor: string,
  appointments: Appointment[],
) => {
  return useMemo(() => {
    if (!selectedDate || !selectedDoctor) return TIME_SLOTS;

    const isDentistAvailable = (timeSlot: string) => {
      const doctorAppointmentsForDay = appointments.filter(
        (apt) =>
          apt.doctorId === selectedDoctor &&
          format(parseISO(apt.date), "yyyy-MM-dd") ===
            format(selectedDate, "yyyy-MM-dd"),
      );
      return (
        !doctorAppointmentsForDay.some((apt) => apt.timeSlot === timeSlot) &&
        doctorAppointmentsForDay.length < 2
      );
    };

    return TIME_SLOTS.filter(isDentistAvailable);
  }, [selectedDate, selectedDoctor, appointments]);
};

export default useAppointmentLogic;
