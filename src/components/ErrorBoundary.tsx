import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In a real app, we would log this to Sentry or another service
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="neo-card p-8 max-w-md w-full text-center space-y-6 border-angry border-l-8">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-angry/10 border-2 border-foreground flex items-center justify-center" style={{ boxShadow: "4px 4px 0px hsl(0 0% 10%)" }}>
                <AlertTriangle className="w-8 h-8 text-angry-accent" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="font-heading font-bold text-2xl">The Stack Crashed!</h2>
              <p className="text-muted-foreground font-body">
                We encountered an unexpected error. Even the best founders face downtime.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-secondary p-4 rounded-lg border border-foreground/10 text-left overflow-auto max-h-32">
                <code className="text-xs font-mono text-angry-accent">
                  {this.state.error.toString()}
                </code>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 neo-button bg-primary text-primary-foreground py-3 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> REBOOT
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="neo-button bg-card text-foreground px-6 py-3 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" /> HOME
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
