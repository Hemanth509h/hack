import { forwardRef, SelectHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertCircle, ChevronDown } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-gray-300">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={twMerge(
              clsx(
                "flex h-11 w-full appearance-none rounded-xl border bg-surface pl-4 pr-10 py-2 text-sm text-white transition-all",
                "focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:cursor-not-allowed disabled:opacity-50",
                error ? "border-red-500 focus:border-red-500 focus:ring-red-500/50" : "border-border hover:border-gray-600 focus:border-primary-500",
                className
              )
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-description` : undefined}
            {...props}
          >
            {/* Map options appropriately. Disable first 'placeholder' option if empty string value */}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.value === '' && props.required}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            <ChevronDown size={18} />
          </div>
        </div>

        {error && (
          <p id={`${selectId}-error`} className="text-sm text-red-500 flex items-center space-x-1 mt-1">
            <AlertCircle size={14} />
            <span>{error}</span>
          </p>
        )}
        
        {helperText && !error && (
          <p id={`${selectId}-description`} className="text-sm text-gray-500 mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
