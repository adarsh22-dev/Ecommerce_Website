"use client";

import { cn } from "@/lib/utils";

interface RadioGroupProps {
  options: { label: string; value: string; description?: string }[];
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  className?: string;
}

export function RadioGroup({ options, value, onChange, name, className }: RadioGroupProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-200",
            value === option.value
              ? "border-primary bg-primary/5 ring-1 ring-primary"
              : "border-border hover:border-foreground/20"
          )}
        >
          <div className="relative flex-shrink-0">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange?.(option.value)}
              className="peer sr-only"
            />
            <div className="h-5 w-5 rounded-full border-2 border-border transition-all duration-200 peer-checked:border-primary flex items-center justify-center">
              {value === option.value && (
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
              )}
            </div>
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-foreground">{option.label}</span>
            {option.description && (
              <p className="mt-0.5 text-xs text-foreground-secondary">{option.description}</p>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}
