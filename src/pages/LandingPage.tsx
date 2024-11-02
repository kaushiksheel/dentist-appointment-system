import { motion } from "framer-motion";
import { ShieldCheck, Stethoscope, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { containerVariants, itemVariants } from "@/lib/framer-config";
import { cn } from "@/lib/utils";

interface UserType {
  type: "dentist" | "admin" | "customer";
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const userTypes: UserType[] = [
  {
    type: "dentist",
    title: "Doctor",
    description: "Access your appointments and manage patient records",
    icon: Stethoscope,
    color:
      "from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20",
  },
  {
    type: "admin",
    title: "Admin",
    description: "Manage the system, users, and monitor activities",
    icon: ShieldCheck,
    color:
      "from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20",
  },
  {
    type: "customer",
    title: "Customer",
    description: "Book appointments and view your dental history",
    icon: User,
    color:
      "from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20",
  },
];

export default function WhoAmI() {
  const [selectedType, setSelectedType] = useState<UserType["type"] | null>(
    null,
  );
  const navigate = useNavigate();

  const handleSelection = (type: UserType["type"]) => {
    setSelectedType(type);
    setTimeout(() => {
      navigate(`/${type}/login`);
    }, 500);
  };

  return (
    <div className="bg-dot-white/[0.2] relative min-h-screen w-full overflow-hidden bg-gradient-to-tr from-background via-background/95 to-muted">
      <div className="absolute inset-0 bg-gradient-to-t from-background to-background/0 backdrop-blur-[1px]" />
      <div className="container relative flex min-h-screen flex-col items-center justify-center px-4">
        <motion.div
          className="w-full max-w-5xl"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Card className="border border-none bg-background/60">
            <CardHeader className="space-y-6 text-center">
              <motion.div variants={itemVariants}>
                <CardTitle className="text-4xl font-bold tracking-tight">
                  Welcome to Dental Care
                </CardTitle>
                <CardDescription className="pt-2 text-lg text-muted-foreground">
                  Choose your role to get started
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="grid gap-6 p-8 md:grid-cols-3">
              {userTypes.map((userType) => (
                <motion.div key={userType.type} variants={itemVariants}>
                  <Button
                    variant="outline"
                    className={cn(
                      "group relative h-[200px] w-full flex-col items-center justify-center gap-6 overflow-hidden border-2 bg-gradient-to-br p-6 transition-all duration-300",
                      userType.color,
                      selectedType === userType.type &&
                        "border-primary ring-2 ring-primary ring-offset-2",
                    )}
                    onClick={() => handleSelection(userType.type)}
                  >
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br opacity-0 blur transition-opacity duration-500 group-hover:opacity-100" />
                    <userType.icon className="!size-14 transition-transform duration-300 group-hover:scale-110" />
                    <div className="text-center">
                      <h3 className="text-xl font-semibold">
                        {userType.title}
                      </h3>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
            <CardFooter className="pb-8">
              <p className="mx-auto max-w-xs text-center text-sm text-muted-foreground">
                Not sure which option to choose?{" "}
                <Button variant="link" className="h-auto p-0 text-sm">
                  Contact our support team
                </Button>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
