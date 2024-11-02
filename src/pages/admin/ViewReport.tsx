import { columns } from "@/components/admin/table/view-report/Coloumns";
import { DataTable } from "@/components/DataTable";
import { useAllAppointments } from "@/hooks/useAllAppointments";
import { useDentists } from "@/hooks/useDentists";
import { format, parseISO } from "date-fns";
import { useMemo } from "react";

interface AggregatedAppointment {
  date: string;
  dentistName: string;
  numberOfBookings: number;
  dentistId: string;
}

const ViewReport = () => {
  const { appointments, loading } = useAllAppointments();
  const { dentists } = useDentists();

  const aggregatedAppointments = useMemo(() => {
    if (!appointments || !dentists) return [];

    const appointmentMap = new Map<string, Map<string, number>>();

    appointments.forEach((apt) => {
      const dateStr = format(parseISO(apt.date), "yyyy-MM-dd");

      if (!appointmentMap.has(dateStr)) {
        appointmentMap.set(dateStr, new Map());
      }

      const dentistMap = appointmentMap.get(dateStr)!;
      const currentCount = dentistMap.get(apt.doctorId) || 0;
      dentistMap.set(apt.doctorId, currentCount + 1);
    });

    const result: AggregatedAppointment[] = [];

    appointmentMap.forEach((dentistMap, date) => {
      dentistMap.forEach((count, dentistId) => {
        const dentist = dentists.find((d) => d.id === dentistId);
        result.push({
          date,
          dentistId,
          dentistName: dentist?.fullName || dentistId,
          numberOfBookings: count,
        });
      });
    });

    return result.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return a.dentistName.localeCompare(b.dentistName);
    });
  }, [appointments, dentists]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h2 className="mb-4 text-2xl font-bold">Appointment Reports</h2>
      <DataTable columns={columns} data={aggregatedAppointments} />
    </div>
  );
};

export default ViewReport;
