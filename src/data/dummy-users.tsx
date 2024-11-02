import { Stethoscope, User } from "lucide-react";

export const DUMMY_USERS = {
  DENTIST: {
    email: "dentist@demo.com",
    password: "dentist123",
    label: "Login as Demo Dentist",
    icon: <Stethoscope className="mr-2 h-4 w-4" />,
  },
  CUSTOMER: {
    email: "customer@demo.com",
    password: "customer123",
    label: "Login as Demo Customer",
    icon: <User className="mr-2 h-4 w-4" />,
  },
  ADMIN: {
    email: "admin@demo.com",
    password: "admin123",
    label: "Login as Demo Admin",
    icon: <User className="mr-2 h-4 w-4" />,
  },
} as const;
