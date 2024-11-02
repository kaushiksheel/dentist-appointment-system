import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appointment } from "@/interfaces";
import { addDays, format, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const TIME_SLOTS = [
  "8:30 AM",
  "9:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:30 PM",
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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
      const aptDate = new Date(apt.date);
      return (
        format(aptDate, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd") &&
        format(aptDate, "h:mm a") === timeSlot
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
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((timeSlot) => (
                <tr key={timeSlot}>
                  <td className="border p-2 text-sm font-medium">{timeSlot}</td>
                  {DAYS.map((day) => {
                    const appointment = getAppointmentForSlot(day, timeSlot);
                    return (
                      <td key={`${day}-${timeSlot}`} className="border p-2">
                        {appointment && (
                          <div className="rounded bg-blue-100 p-2 text-xs">
                            <div className="font-medium">
                              {appointment.serviceName}
                            </div>
                            <div className="text-gray-600">
                              Dr. {appointment.doctorEmail.split("@")[0]}
                            </div>
                          </div>
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
