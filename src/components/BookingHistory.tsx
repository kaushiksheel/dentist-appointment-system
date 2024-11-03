import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appointment } from "@/interfaces";
import { addDays, format, startOfWeek, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const TIME_SLOTS = [
  { display: "8:30 AM", value: "08:30" },
  { display: "9:30 AM", value: "09:30" },
  { display: "10:30 AM", value: "10:30" },
  { display: "11:30 AM", value: "11:30" },
  { display: "12:00 PM", value: "12:00" },
  { display: "2:00 PM", value: "14:00" },
  { display: "3:00 PM", value: "15:00" },
  { display: "4:00 PM", value: "16:00" },
  { display: "5:30 PM", value: "17:30" },
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface AppointmentDisplayProps {
  appointment: Appointment;
  isCompleted?: boolean;
}

const AppointmentDisplay = ({
  appointment,
  isCompleted,
}: AppointmentDisplayProps) => (
  <div
    className={`rounded p-2 text-xs ${
      isCompleted ? "bg-green-500 text-white" : "bg-blue-500 text-white"
    }`}
  >
    <div className="line-clamp-2 font-medium">{appointment.serviceName}</div>
    <div className="capitalize text-gray-200">
      Dr. {appointment.doctorEmail.split("@")[0]}
    </div>
    <div className="mt-1 text-xs text-gray-200">₹{appointment.subTotal}</div>
  </div>
);

const BookingHistory = ({ appointments }: { appointments: Appointment[] }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const startOfCurrentWeek = startOfWeek(currentWeek, { weekStartsOn: 1 });

  const nextWeek = () => {
    setCurrentWeek(addDays(currentWeek, 7));
  };

  const previousWeek = () => {
    setCurrentWeek(addDays(currentWeek, -7));
  };

  const getAppointmentForSlot = (day: string, timeSlot: string) => {
    const currentDate = addDays(startOfCurrentWeek, DAYS.indexOf(day));

    return appointments.find((apt) => {
      const aptDate = parseISO(apt.date);
      return (
        format(aptDate, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd") &&
        apt.timeSlot === timeSlot
      );
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Booking History</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={previousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            {format(startOfCurrentWeek, "d MMM")} -{" "}
            {format(addDays(startOfCurrentWeek, 5), "d MMM yyyy")}
          </span>
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-left">Time</th>
                {DAYS.map((day) => (
                  <th key={day} className="border p-2 text-center">
                    <div>{day}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(
                        addDays(startOfCurrentWeek, DAYS.indexOf(day)),
                        "MMM d",
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((timeSlot) => (
                <tr key={timeSlot.value}>
                  <td className="border p-2 text-sm font-medium">
                    {timeSlot.display}
                  </td>
                  {DAYS.map((day) => {
                    const appointment = getAppointmentForSlot(
                      day,
                      timeSlot.value,
                    );
                    return (
                      <td
                        key={`${day}-${timeSlot.value}`}
                        className="min-w-[200px] border p-2"
                      >
                        {appointment && (
                          <AppointmentDisplay
                            appointment={appointment}
                            isCompleted={appointment.completed}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingHistory;
