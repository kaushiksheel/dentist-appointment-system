import { useState, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import { useDentists } from "@/hooks/useDentists";
import { useServices } from "@/hooks/useServices";
import { useAppointments } from "@/hooks/useCurrentUserAppointments";
import { addAppointment } from "@/services/firestoreService";
import {
  format,
  isWeekend,
  parseISO,
  setHours,
  setMinutes,
  isBefore,
  isAfter,
} from "date-fns";
import { Appointment } from "@/interfaces";

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

export function useAppointmentBooking() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedService, setSelectedService] = useState("");

  const { isAuthenticated, user } = useAuth();
  const { appointments, loading: appointmentsLoading } = useAppointments(
    user?.uid as string,
  );
  const { toast } = useToast();
  const {
    dentists,
    loading: loadingDentists,
    error: dentistsError,
  } = useDentists();
  const {
    services,
    loading: loadingServices,
    error: servicesError,
  } = useServices();

  const handleDateClick = useCallback(
    (date: Date) => {
      if (isWeekend(date)) {
        toast({
          title: "Invalid Selection",
          description: "Bookings are only available from Monday to Friday.",
          variant: "destructive",
        });
        return;
      }
      setSelectedDate(date);
    },
    [toast],
  );

  const handleCloseModal = () => {
    setSelectedDate(null);
    setSelectedTimeSlot("");
    setSelectedDoctor("");
    setSelectedService("");
  };

  const selectedServiceDetails = useMemo(() => {
    return services.find((s) => s.id === selectedService);
  }, [selectedService, services]);

  const selectedDoctorDetails = useMemo(() => {
    return dentists.find((d) => d.id === selectedDoctor);
  }, [selectedDoctor, dentists]);

  const isDentistAvailable = useCallback(
    (doctorId: string, date: Date, timeSlot: string) => {
      const doctorAppointmentsForDay = appointments.filter(
        (apt) =>
          apt.doctorId === doctorId &&
          format(parseISO(apt.date), "yyyy-MM-dd") ===
            format(date, "yyyy-MM-dd"),
      );

      const hasConflictingTimeSlot = doctorAppointmentsForDay.some(
        (apt) => apt.timeSlot === timeSlot,
      );

      const hasReachedDailyLimit = doctorAppointmentsForDay.length >= 2;

      return !hasConflictingTimeSlot && !hasReachedDailyLimit;
    },
    [appointments],
  );

  const subTotal = useCallback(() => {
    if (!selectedServiceDetails) return 0;
    const doctorHourlyRate =
      dentists?.find(({ id }) => id === selectedDoctor)?.hourlyRate || 0;
    return selectedServiceDetails?.price + doctorHourlyRate;
  }, [selectedServiceDetails, selectedDoctor, dentists]);

  const handleBookAppointment = useCallback(() => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book an appointment.",
        variant: "destructive",
      });
      return;
    }

    if (selectedDate && selectedDoctor && selectedService && selectedTimeSlot) {
      if (!isDentistAvailable(selectedDoctor, selectedDate, selectedTimeSlot)) {
        toast({
          title: "Dentist Unavailable",
          description:
            "This dentist is not available for the selected time slot. They may have reached their daily limit or have a conflicting appointment.",
          variant: "destructive",
        });
        return;
      }

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
        subTotal: subTotal(),
      };

      handleCloseModal();
      toast({
        title: "Appointment Booked",
        description: `Your appointment for ${selectedServiceDetails?.serviceName} is scheduled for ${format(
          appointmentDateTime,
          "MMMM d, yyyy 'at' h:mm a",
        )}`,
      });

      addAppointment(newAppointment);
    }
  }, [
    selectedDate,
    selectedDoctor,
    selectedService,
    selectedTimeSlot,
    selectedServiceDetails,
    selectedDoctorDetails,
    isAuthenticated,
    user,
    toast,
    isDentistAvailable,
    subTotal,
  ]);

  const getAvailableTimeSlots = useMemo(() => {
    if (!selectedDate || !selectedDoctor) return TIME_SLOTS;

    return TIME_SLOTS.filter((slot) =>
      isDentistAvailable(selectedDoctor, selectedDate, slot),
    );
  }, [selectedDate, selectedDoctor, isDentistAvailable]);

  return {
    currentDate,
    setCurrentDate,
    selectedDate,
    setSelectedDate,
    selectedTimeSlot,
    setSelectedTimeSlot,
    selectedDoctor,
    setSelectedDoctor,
    selectedService,
    setSelectedService,
    appointments,
    dentists,
    services,
    handleDateClick,
    handleCloseModal,
    handleBookAppointment,
    isDentistAvailable,
    subTotal,
    getAvailableTimeSlots,
    loadingDentists,
    loadingServices,
    appointmentsLoading,
    dentistsError,
    servicesError,
  };
}
