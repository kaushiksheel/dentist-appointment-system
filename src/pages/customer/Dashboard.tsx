import { Calendar } from "@/components/Calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import { useDentists } from "@/hooks/useDentists";
import { useServices } from "@/hooks/useServices";
import { addAppointment } from "@/services/firestoreService";
import { useAppointments } from "@/hooks/useCurrentUserAppointments";
import {
  format,
  isWeekend,
  parseISO,
  setHours,
  setMinutes,
  isBefore,
  isAfter,
} from "date-fns";
import { useCallback, useEffect, useState, useMemo } from "react";

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

export interface Appointment {
  id?: string;
  date: string;
  doctorId: string;
  serviceId: string;
  doctorEmail: string;
  serviceName: string;
  userUID: string;
  timeSlot: string;
  completed: boolean;
  customerName: string;
  subTotal: number;
}

export default function AppointmentPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const { isAuthenticated, user } = useAuth();
  const { appointments: fetchedAppointments, loading: appointmentsLoading } =
    useAppointments(user?.uid as string);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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

  useEffect(() => {
    if (!appointmentsLoading && fetchedAppointments) {
      setAppointments(fetchedAppointments);
    }
  }, [fetchedAppointments, appointmentsLoading]);

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

  const subTotal = () => {
    if (!selectedServiceDetails) return;
    const doctorHourlyRate = dentists?.find(
      ({ id }) => id === selectedDoctor,
    )?.hourlyRate;
    return selectedServiceDetails?.price + doctorHourlyRate!;
  };

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
        subTotal: subTotal()!,
      };

      setAppointments((prevAppointments) => [
        ...prevAppointments,
        newAppointment,
      ]);
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
  ]);

  const getAvailableTimeSlots = useMemo(() => {
    if (!selectedDate || !selectedDoctor) return TIME_SLOTS;

    return TIME_SLOTS.filter((slot) =>
      isDentistAvailable(selectedDoctor, selectedDate, slot),
    );
  }, [selectedDate, selectedDoctor, isDentistAvailable]);

  if (loadingDentists || loadingServices || appointmentsLoading) {
    return <div>Loading...</div>;
  }

  if (dentistsError || servicesError) {
    return <div>Error: {dentistsError?.message || servicesError?.message}</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <Calendar
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onDateClick={handleDateClick}
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
        }))}
        isDateDisabled={isWeekend}
      />

      <Dialog open={selectedDate !== null} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-center gap-4 py-4">
            <span className="text-sm font-medium">
              {selectedDate && format(selectedDate, "dd MMMM yyyy")}
            </span>
          </div>

          <div className="space-y-4">
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger>
                <SelectValue placeholder="Select Dentist" />
              </SelectTrigger>
              <SelectContent>
                {dentists.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.fullName}
                    <span className="grid">₹{doctor.hourlyRate}/hr</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Select Service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.serviceName}
                    <span className="grid">₹{service.price}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div>
              <div className="mb-2 text-sm font-medium">Select Time Slot</div>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedTimeSlot === slot ? "default" : "outline"}
                    className="w-full text-xs"
                    onClick={() => setSelectedTimeSlot(slot)}
                    disabled={!getAvailableTimeSlots.includes(slot)}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <span className="text-lg font-semibold">
                  Rs. {subTotal() || "0.00"}
                </span>
                <span className="text-sm text-gray-500"> including GST</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button onClick={handleBookAppointment}>Book & Pay</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
