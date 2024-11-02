import { Button } from "./ui/button";

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

interface TimeSlotSelectorProps {
  selectedTimeSlot: string;
  availableTimeSlots: string[];
  onTimeSlotChange: (slot: string) => void;
}

const TimeSlotSelector = ({
  selectedTimeSlot,
  availableTimeSlots,
  onTimeSlotChange,
}: TimeSlotSelectorProps) => (
  <div>
    <div className="mb-2 text-sm font-medium">Select Time Slot</div>
    <div className="grid grid-cols-3 gap-2">
      {TIME_SLOTS.map((slot) => (
        <Button
          key={slot}
          variant={selectedTimeSlot === slot ? "default" : "outline"}
          className="w-full text-xs"
          onClick={() => onTimeSlotChange(slot)}
          disabled={!availableTimeSlots.includes(slot)}
        >
          {slot}
        </Button>
      ))}
    </div>
  </div>
);

export default TimeSlotSelector;
