import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <p className="mb-8 text-2xl">Oops! Page not found.</p>
      <Button asChild>
        <Link to="/" className="flex items-center">
          <HomeIcon className="mr-2 h-4 w-4" />
          Go back home
        </Link>
      </Button>
    </div>
  );
}
