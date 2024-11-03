import DialogDetails from "@/components/ReportDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AggregatedAppointment } from "@/pages/admin/ViewReport";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<AggregatedAppointment>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "dentistName",
    header: "Dentist Name",
  },
  {
    accessorKey: "numberOfBookings",
    header: "Number of Bookings",
  },
  {
    id: "action",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">View</Button>
          </DialogTrigger>
          <DialogDetails data={data} />
        </Dialog>
      );
    },
    header: "Action",
    enableHiding: false,
  },
];
