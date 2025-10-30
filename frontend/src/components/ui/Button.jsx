import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import './Button.css';

const Button = React.forwardRef(
  ({ className = "", variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const classes = [
      'btn-base',
      `btn-variant-${variant}`,
      `btn-size-${size}`,
      className
    ].filter(Boolean).join(' ');
    
    return (
      <Comp
        className={classes}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };

