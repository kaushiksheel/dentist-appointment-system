import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, Mail } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface LoginCardProps {
  onSubmit: (email: string, password: string) => void;
  signupLink?: string;
}

export default function LoginCard({ onSubmit, signupLink }: LoginCardProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <Card className="w-[370px]">
      <CardHeader className="flex justify-center">
        <h2 className="text-xl font-medium">Login</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
              size={18}
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
              size={18}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" className="w-full">
            Log In
          </Button>
        </form>
      </CardContent>
      {signupLink && (
        <CardFooter>
          <CardDescription>
            Don't have an account?{" "}
            <Link
              to={signupLink}
              className="text-blue-500 transition hover:underline"
            >
              Signup
            </Link>
          </CardDescription>
        </CardFooter>
      )}
    </Card>
  );
}
