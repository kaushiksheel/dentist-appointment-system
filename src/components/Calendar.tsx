/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarAppointment {
  id: string;
  date: Date;
  serviceName: string;
  completed: boolean;
  originalAppointment?: any;
}

interface CustomCalendarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onDateClick?: (date: Date) => void;
  onAppointmentClick?: (
    appointment: CalendarAppointment["originalAppointment"],
  ) => void;
  appointments?: CalendarAppointment[];
  className?: string;
  isDateDisabled?: (date: Date) => boolean;
}

export const Calendar: React.FC<CustomCalendarProps> = ({
  currentDate,
  onDateChange,
  onDateClick,
  onAppointmentClick,
  appointments = [],
  className,
  isDateDisabled,
}) => {
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const daysInView = eachDayOfInterval({ start: startDate, end: endDate });
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const previousMonth = () => onDateChange(addMonths(currentDate, -1));
  const nextMonth = () => onDateChange(addMonths(currentDate, 1));

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((apt) => isSameDay(apt.date, date));
  };

  const handleDateClick = (date: Date) => {
    if (onDateClick) {
      onDateClick(date);
    }
  };

  const handleAppointmentClick = (
    e: React.MouseEvent,
    appointment: CalendarAppointment,
  ) => {
    e.stopPropagation();
    if (onAppointmentClick) {
      onAppointmentClick(appointment.originalAppointment);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-4 flex items-center justify-end">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {format(currentDate, "MMMM yyyy")}
            </span>
            <Button variant="ghost" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="grid grid-cols-7 border-b border-border">
          {dayNames.map((day) => (
            <div
              key={day}
              className="border-border px-3 py-2 text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {daysInView.map((day, index) => (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[100px] cursor-pointer border-b border-r border-border p-2 transition-colors",
                !isSameMonth(day, currentDate) &&
                  "bg-muted/50 text-muted-foreground",
                index % 7 === 6 && "border-r-0",
                isDateDisabled?.(day) && "pointer-events-none bg-muted",
                isSameMonth(day, currentDate) && "bg-background",
              )}
              onClick={() => handleDateClick(day)}
            >
              <span className="text-sm font-medium">{format(day, "d")}</span>
              <div className="space-y-1">
                {getAppointmentsForDate(day).map((apt) => (
                  <div
                    key={apt.id}
                    className={cn(
                      "w-full rounded px-2 py-1 text-left text-xs transition-colors",
                      apt.completed
                        ? "bg-emerald-500/90 text-emerald-50 hover:bg-emerald-500 dark:bg-emerald-600/90 dark:hover:bg-emerald-600"
                        : "bg-primary/90 text-primary-foreground hover:bg-primary dark:bg-primary/80 dark:hover:bg-primary/90",
                    )}
                    onClick={(e) => handleAppointmentClick(e, apt)}
                  >
                    {apt.serviceName}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
