/* eslint-disable @typescript-eslint/no-explicit-any */

import { format, setHours, setMinutes, isBefore, isAfter } from "date-fns";
import { addAppointment } from "@/services/firestoreService";
import { Appointment } from "@/interfaces";

interface AppointmentActionsProps {
  selectedDate: Date | null;
  selectedDoctor: string;
  selectedService: string;
  selectedTimeSlot: string;
  selectedServiceDetails: any;
  selectedDoctorDetails: any;
  isAuthenticated: boolean;
  user: any;
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  handleCloseModal: () => void;
  toast: any;
}

export const useAppointmentActions = ({
  selectedDate,
  selectedDoctor,
  selectedService,
  selectedTimeSlot,
  selectedServiceDetails,
  selectedDoctorDetails,
  isAuthenticated,
  user,
  appointments,
  setAppointments,
  handleCloseModal,
  toast,
}: AppointmentActionsProps) => {
  const calculateSubTotal = () => {
    if (!selectedServiceDetails) return 0;
    const doctorHourlyRate = selectedDoctorDetails?.hourlyRate || 0;
    return selectedServiceDetails.price + doctorHourlyRate;
  };

  const isDentistAvailable = (date: Date, timeSlot: string) => {
    const doctorAppointmentsForDay = appointments.filter(
      (apt) =>
        apt.doctorId === selectedDoctor &&
        format(new Date(apt.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd"),
    );

    return (
      !doctorAppointmentsForDay.some((apt) => apt.timeSlot === timeSlot) &&
      doctorAppointmentsForDay.length < 2
    );
  };

  const handleBookAppointment = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book an appointment.",
        variant: "destructive",
      });
      return;
    }

    if (
      !(selectedDate && selectedDoctor && selectedService && selectedTimeSlot)
    ) {
      toast({
        title: "Incomplete Details",
        description: "Please fill in all appointment details.",
        variant: "destructive",
      });
      return;
    }

    // Check dentist availability
    if (!isDentistAvailable(selectedDate, selectedTimeSlot)) {
      toast({
        title: "Dentist Unavailable",
        description:
          "This dentist is not available for the selected time slot.",
        variant: "destructive",
      });
      return;
    }

    // Validate appointment time
    const [hours, minutes] = selectedTimeSlot.split(":").map(Number);
    const appointmentDateTime = setMinutes(
      setHours(selectedDate, hours),
      minutes,
    );
    const startTime = setMinutes(setHours(selectedDate, 8), 30);
    const endTime = setMinutes(setHours(selectedDate, 17), 30);

    if (
      isBefore(appointmentDateTime, startTime) ||
      isAfter(appointmentDateTime, endTime)
    ) {
      toast({
        title: "Invalid Time",
        description:
          "Appointments can only be booked between 8:30 AM and 5:30 PM.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newAppointment: Appointment = {
        date: appointmentDateTime.toISOString(),
        doctorId: selectedDoctor,
        serviceId: selectedService,
        doctorEmail: selectedDoctorDetails?.email || "",
        serviceName: selectedServiceDetails?.serviceName || "",
        customerName: user.displayName!,
        userUID: user.uid,
        timeSlot: selectedTimeSlot,
        completed: false,
        subTotal: calculateSubTotal(),
      };

      await addAppointment(newAppointment);

      setAppointments([...appointments, newAppointment]);

      toast({
        title: "Appointment Booked",
        description: `Your appointment for ${selectedServiceDetails?.serviceName} is scheduled for ${format(
          appointmentDateTime,
          "MMMM d, yyyy 'at' h:mm a",
        )}`,
      });

      handleCloseModal();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "An error occurred",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return {
    handleBookAppointment,
    calculateSubTotal,
  };
};
