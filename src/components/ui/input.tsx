"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  textarea?: boolean;
  rows?: number;
  type?: React.HTMLInputTypeAttribute | "textarea";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, type, textarea, rows = 4, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasValue = props.value || props.defaultValue;

    const commonClassName = cn(
      "w-full rounded-lg border bg-white px-4 py-3 text-sm text-foreground transition-all duration-200 placeholder:text-foreground-secondary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
      leftIcon && "pl-10",
      rightIcon && "pr-10",
      error
        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
        : "border-border",
      className
    );

    const renderField = () => {
      if (textarea) {
        return (
          <textarea
            className={cn(commonClassName, "min-h-[104px] resize-y")}
            rows={rows}
            placeholder={label}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        );
      }

      return (
        <input
          ref={ref}
          type={type || "text"}
          className={cn(
            "flex h-12 w-full rounded-lg border bg-white px-4 py-3 text-sm text-foreground transition-all duration-200 placeholder:text-foreground-secondary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error
              ? "border-destructive focus:border-destructive focus:ring-destructive/20"
              : "border-border",
            className
          )}
          placeholder={label}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      );
    };

    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary">
              {leftIcon}
            </div>
          )}
          {label ? (
            <div className="floating-label-group">
              {renderField()}
              <label
                className={cn(
                  "absolute left-4 top-3 text-sm text-foreground-secondary transition-all duration-200 pointer-events-none origin-left",
                  focused || hasValue
                    ? "-translate-y-6 scale-75 text-primary font-medium"
                    : ""
                )}
              >
                {label}
              </label>
            </div>
          ) : (
            renderField()
          )}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-secondary">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-foreground-secondary">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
