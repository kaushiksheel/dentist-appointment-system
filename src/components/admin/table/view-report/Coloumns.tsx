import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Dashboard = {
  date: string;
  dentistName: string;
  numberOfBookings: number;
};

export const columns: ColumnDef<Dashboard>[] = [
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
    accessorKey: "action",
    header: "Action",
    enableHiding: false,
    cell: () =>
      // { row }
      {
        // const payment = row.original

        return <Button variant="outline">View</Button>;
      },
  },
];
