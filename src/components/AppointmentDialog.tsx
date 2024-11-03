/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import TimeSlotSelector from "./TimeSlotSelector";
import { Dentist } from "@/interfaces";
interface AppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  selectedDoctor: string;
  selectedService: string;
  selectedTimeSlot: string;
  dentists: Dentist[];
  services: any[];
  availableTimeSlots: string[];
  onDoctorChange: (value: string) => void;
  onServiceChange: (value: string) => void;
  onTimeSlotChange: (slot: string) => void;
  onBook: () => void;
  subTotal: number;
}

const AppointmentDialog = ({
  isOpen,
  onClose,
  selectedDate,
  selectedDoctor,
  selectedService,
  selectedTimeSlot,
  dentists,
  services,
  availableTimeSlots,
  onDoctorChange,
  onServiceChange,
  onTimeSlotChange,
  onBook,
  subTotal,
}: AppointmentDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
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
        <Select value={selectedDoctor} onValueChange={onDoctorChange}>
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

        <Select value={selectedService} onValueChange={onServiceChange}>
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

        <TimeSlotSelector
          selectedTimeSlot={selectedTimeSlot}
          availableTimeSlots={availableTimeSlots}
          onTimeSlotChange={onTimeSlotChange}
        />

        <div className="flex items-center justify-between pt-4">
          <div>
            <span className="text-lg font-semibold">
              Rs. {subTotal || "0.00"}
            </span>
            <span className="text-sm text-gray-500"> including GST</span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onBook}>Book & Pay</Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default AppointmentDialog;
