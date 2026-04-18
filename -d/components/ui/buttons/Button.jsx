import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-95";

    const variants = {
      primary:
        "bg-primary-500 text-gray-900 dark:text-white hover:bg-primary-600 focus:ring-primary-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]",
      secondary:
        "bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-white/15 border border-black/5 dark:border-white/5 focus:ring-white/20",
      outline:
        "border-2 border-primary-500 text-primary-500 hover:bg-primary-500/10 focus:ring-primary-500",
      ghost:
        "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/10 focus:ring-white/20",
      danger:
        "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/50 focus:ring-red-500",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10 p-2",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  },
);
Button.displayName = "Button";
