import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Dashboard = {
  appointmentDate: string;
  patientName: string;
  dentistName: string;
  serviceRequested: string;
};

export const columns: ColumnDef<Dashboard>[] = [
  {
    accessorKey: "appointmentDate",
    header: "Appointment Date",
  },
  {
    accessorKey: "patientName",
    header: "Patient Name",
  },
  {
    accessorKey: "dentistName",
    header: "Dentist Name",
  },
  {
    accessorKey: "serviceRequested",
    header: "Service Requested",
  },
];
