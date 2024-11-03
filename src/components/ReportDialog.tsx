import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AggregatedAppointment } from "@/pages/admin/ViewReport";

interface DialogDetailsProps {
  data: AggregatedAppointment;
}

const DialogDetails: React.FC<DialogDetailsProps> = ({ data }) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Appointment Details</DialogTitle>
        <DialogDescription>
          Details for appointments on {data.date}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div>
          <h3 className="font-medium">Date</h3>
          <p>{data.date}</p>
        </div>
        <div>
          <h3 className="font-medium">Dentist Name</h3>
          <p>{data.dentistName}</p>
        </div>
        <div>
          <h3 className="font-medium">Number of Bookings</h3>
          <p>{data.numberOfBookings}</p>
        </div>
      </div>
    </DialogContent>
  );
};

export default DialogDetails;
