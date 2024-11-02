import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    // Log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private sanitizeErrorMessage(message: string): string {
    // Remove sensitive information or stack traces
    return message.split("\n")[0].substring(0, 150);
  }

  private getErrorMessage(): string {
    if (!this.state.error) return "An unknown error occurred.";

    if (import.meta.env.MODE === "production") {
      return this.sanitizeErrorMessage(this.state.error.message);
    } else {
      return this.state.error.toString();
    }
  }

  public render() {
    if (this.state.hasError) {
      const errorMessage = this.getErrorMessage();

      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <CardTitle>Oops! Something went wrong</CardTitle>
              </div>
              <CardDescription>
                We're sorry, but an unexpected error has occurred.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Error details: {errorMessage}
              </p>
              {import.meta.env.MODE !== "production" && (
                <details className="text-xs text-muted-foreground">
                  <summary>Stack trace</summary>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {this.state.errorInfo &&
                      this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={this.handleGoHome}>
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
              <Button onClick={this.handleReload}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
