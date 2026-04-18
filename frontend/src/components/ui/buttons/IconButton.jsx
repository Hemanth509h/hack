import React, { forwardRef } from 'react';
import { Button, ButtonProps } from './Button';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export 

export const IconButton = forwardRef(
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
