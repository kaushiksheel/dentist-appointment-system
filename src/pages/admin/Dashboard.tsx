import { columns } from "@/components/admin/table/dashboard/Coloumns";
import { DataTable } from "@/components/DataTable";
import { useAllAppointments } from "@/hooks/useAllAppointments";
import { useDentists } from "@/hooks/useDentists";
import { format, parseISO } from "date-fns";
import { useMemo } from "react";

const Dashboard = () => {
  const { appointments, loading: appointmentsLoading } = useAllAppointments();
  const { dentists, loading: dentistsLoading } = useDentists();

  const modifiedAppointments = useMemo(() => {
    if (!appointments || !dentists) return [];

    return appointments.map((appointment) => {
      const dentist = dentists.find((d) => d.id === appointment.doctorId);

      return {
        appointmentDate: format(parseISO(appointment.date), "yyyy-MM-dd"),
        patientName: appointment.customerName,
        dentistName: dentist?.fullName || "Unknown Dentist",
        serviceRequested: appointment.serviceName,
      };
    });
  }, [appointments, dentists]);

  if (appointmentsLoading || dentistsLoading) {
    return (
      <div className="flex h-[450px] w-full items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h2 className="mb-4 text-2xl font-bold">Appointments Dashboard</h2>
      <DataTable columns={columns} data={modifiedAppointments} />
    </div>
  );
};

export default Dashboard;
