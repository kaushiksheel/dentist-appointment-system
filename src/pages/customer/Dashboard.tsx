import AppointmentDialog from "@/components/AppointmentDialog";
import BookingHistory from "@/components/BookingHistory";
import { Calendar } from "@/components/Calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatAppointments } from "@/helpers/formatAppointment";
import { useToast } from "@/hooks/use-toast";
import useAppointmentLogic from "@/hooks/useAppointment";
import { useAppointmentActions } from "@/hooks/useAppointmentActions";
import useAuth from "@/hooks/useAuth";
import { useAppointments } from "@/hooks/useCurrentUserAppointments";
import { useDentists } from "@/hooks/useDentists";
import { useServices } from "@/hooks/useServices";
import { Appointment } from "@/interfaces";
import { isWeekend } from "date-fns";
import { useEffect, useMemo, useState } from "react";

export default function AppointmentPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Hooks
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const { appointments: fetchedAppointments, loading: appointmentsLoading } =
    useAppointments(user?.uid as string);
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

  // Memoized Values and Handlers
  const selectedServiceDetails = useMemo(
    () => services.find((s) => s.id === selectedService),
    [selectedService, services],
  );
  const selectedDoctorDetails = useMemo(
    () => dentists.find((d) => d.id === selectedDoctor),
    [selectedDoctor, dentists],
  );
  const availableTimeSlots = useAppointmentLogic(
    selectedDate,
    selectedDoctor,
    appointments,
  );

  const { handleBookAppointment, calculateSubTotal } = useAppointmentActions({
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
    handleCloseModal: () => setSelectedDate(null),
    toast,
  });

  // Effects
  useEffect(() => {
    if (!appointmentsLoading && fetchedAppointments) {
      setAppointments(fetchedAppointments);
    }
  }, [fetchedAppointments, appointmentsLoading]);

  if (loadingDentists || loadingServices || appointmentsLoading)
    return <div>Loading...</div>;
  if (dentistsError || servicesError)
    return <div>Error: {dentistsError?.message || servicesError?.message}</div>;

  return (
    <div className="min-h-screen p-6">
      <Tabs defaultValue="book-appointment" className="w-full">
        <TabsList>
          <TabsTrigger value="book-appointment">Book Appointment</TabsTrigger>
          <TabsTrigger value="booking-history">Booking History</TabsTrigger>
        </TabsList>

        <TabsContent value="book-appointment">
          <Calendar
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            onDateClick={(date) => setSelectedDate(date)}
            appointments={formatAppointments(appointments, dentists)}
            isDateDisabled={isWeekend}
          />
        </TabsContent>

        <TabsContent value="booking-history">
          <BookingHistory appointments={appointments} />
        </TabsContent>
      </Tabs>

      <AppointmentDialog
        isOpen={selectedDate !== null}
        onClose={() => setSelectedDate(null)}
        selectedDate={selectedDate}
        selectedDoctor={selectedDoctor}
        selectedService={selectedService}
        selectedTimeSlot={selectedTimeSlot}
        dentists={dentists}
        services={services}
        availableTimeSlots={availableTimeSlots}
        onDoctorChange={setSelectedDoctor}
        onServiceChange={setSelectedService}
        onTimeSlotChange={setSelectedTimeSlot}
        onBook={handleBookAppointment}
        subTotal={calculateSubTotal()}
      />
    </div>
  );
}
