import React, { forwardRef, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, maxLength, id, onChange, ...props }, ref) => {
    const inputId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
    const [charCount, setCharCount] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      if (onChange) onChange(e);
    };

    return (
      <div className="w-full flex flex-col space-y-1.5">
        <div className="flex justify-between items-center">
          {label && (
            <label htmlFor={inputId} className="text-sm font-medium text-gray-300">
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {maxLength && (
            <span className={twMerge(clsx("text-xs transition-colors", charCount >= maxLength ? "text-red-500 font-bold" : "text-gray-500"))}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
        
        <div className="relative">
          <textarea
            id={inputId}
            ref={ref}
            onChange={handleChange}
            maxLength={maxLength}
            className={twMerge(
              clsx(
                "flex min-h-[100px] w-full rounded-xl border bg-surface px-4 py-3 text-sm text-white resize-y transition-all",
                "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50",
                "disabled:cursor-not-allowed disabled:opacity-50",
                error ? "border-red-500 focus:border-red-500 focus:ring-red-500/50" : "border-border hover:border-gray-600 focus:border-primary-500",
                className
              )
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-description` : undefined}
            {...props}
          />
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-500 flex items-center space-x-1 mt-1">
            <AlertCircle size={14} />
            <span>{error}</span>
          </p>
        )}
        
        {helperText && !error && (
          <p id={`${inputId}-description`} className="text-sm text-gray-500 mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
