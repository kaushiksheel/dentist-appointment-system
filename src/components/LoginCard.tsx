import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";

interface DummyUser {
  email: string;
  password: string;
  label: string;
  icon: React.ReactNode;
}

interface LoginCardProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  signupLink?: string;
  title?: string;
  dummyUser?: DummyUser;
  showDummyLogin?: boolean;
}

export default function LoginCard({
  onSubmit,
  signupLink,
  title = "Login",
  dummyUser,
  showDummyLogin = true,
}: LoginCardProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDummyLogin = async () => {
    if (!dummyUser) return;
    setEmail(dummyUser.email);
    setPassword(dummyUser.password);
    setIsLoading(true);
    try {
      await onSubmit(dummyUser.email, dummyUser.password);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="w-[370px]">
      <CardHeader className="flex justify-center">
        <h2 className="text-xl font-medium">{title}</h2>
      </CardHeader>
      <CardContent>
        {showDummyLogin && dummyUser && (
          <>
            <div className="mb-4">
              <Button
                type="button"
                variant="outline"
                className="relative w-full"
                onClick={handleDummyLogin}
                disabled={isLoading}
              >
                {dummyUser.icon}

                {dummyUser.label}
              </Button>
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or continue with
                </span>
              </div>
            </div>
          </>
        )}

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
              disabled={isLoading}
            />
          </div>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
              size={18}
            />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600 focus:outline-none"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff size={18} className="text-muted-foreground" />
              ) : (
                <Eye size={18} className="text-muted-foreground" />
              )}
            </button>
          </div>
          <Button
            disabled={!email || !password || isLoading}
            type="submit"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Spinner />
              </>
            ) : (
              "Log In"
            )}
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
