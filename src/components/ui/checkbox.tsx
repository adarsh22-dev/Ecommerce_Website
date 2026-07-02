"use client";

import { cn } from "@/lib/utils";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export function Checkbox({ className, label, error, ...props }: CheckboxProps) {
  return (
    <div className="w-full">
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            className="peer sr-only"
            {...props}
          />
          <div className="h-5 w-5 rounded-md border-2 border-border transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
            <svg
              className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        {label && <span className="text-sm text-foreground">{label}</span>}
      </label>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
