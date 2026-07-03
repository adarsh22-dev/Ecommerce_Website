"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="font-serif text-3xl text-foreground mb-3">Something went wrong</h1>
        <p className="text-foreground-secondary mb-8 leading-relaxed">
          An unexpected error occurred. Our team has been notified. Please try again or return home.
        </p>
        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mb-6 p-4 bg-muted rounded-lg text-left">
            <p className="text-xs font-mono text-destructive break-words">{error.message}</p>
            {error.digest && (
              <p className="text-xs font-mono text-foreground-secondary mt-2">Error ID: {error.digest}</p>
            )}
          </div>
        )}
        <div className="flex items-center justify-center gap-3">
          <Button onClick={reset} className="shimmer-btn">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="secondary">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}