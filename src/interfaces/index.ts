export interface Appointment {
  id?: string;
  date: string;
  doctorId: string;
  serviceId: string;
  doctorEmail: string;
  serviceName: string;
  userUID: string;
  timeSlot: string;
  completed: boolean;
  customerName: string;
  subTotal: number;
}
