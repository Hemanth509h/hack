import React, { forwardRef } from 'react';
import { Button, ButtonProps } from './Button';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon'> {
  icon: React.ReactNode;
  isRounded?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, isRounded = false, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size="icon"
        className={twMerge(clsx(isRounded && 'rounded-full', className))}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);
IconButton.displayName = 'IconButton';
