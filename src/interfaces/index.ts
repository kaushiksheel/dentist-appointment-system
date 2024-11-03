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

export interface IUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface IAuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  loading: boolean;
}

export interface Dentist {
  id: string;
  mobileNo: string;
  fullName: string;
  hourlyRate: number;
  email: string;
  gender: "male" | "female" | "other";
  username: string;
}

export interface Service {
  id: string;
  price: number;
  serviceName: string;
}
