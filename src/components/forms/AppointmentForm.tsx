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
import { format } from "date-fns";

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

export default function AppointmentForm({
  selectedDate,
  selectedDoctor,
  selectedService,
  selectedTimeSlot,
  dentists,
  services,
  getAvailableTimeSlots,
  subTotal,
  handleCloseModal,
  handleBookAppointment,
  setSelectedDoctor,
  setSelectedService,
  setSelectedTimeSlot,
}) {
  return (
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
  );
}
