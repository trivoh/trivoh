import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline" | "secondary"; // ✅ Add "secondary"
  size?: "default" | "sm";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-colors hover:cursor-pointer disabled:opacity-50 disabled:pointer-events-none",

          // Variant styles
          variant === "default" && "bg-primary text-white hover:bg-primary/90",
          variant === "ghost" && "bg-transparent hover:bg-gray-100 text-gray-700",
          variant === "outline" && "border border-gray-300 text-gray-700 hover:bg-gray-100",
          variant === "secondary" && "bg-gray-200 text-gray-800 hover:bg-gray-300", // ✅ Added secondary styling

          // Size styles
          size === "default" && "h-10 px-4 py-2 text-sm",
          size === "sm" && "h-8 px-2 text-sm",

          className
        )}
        {...props}
      />
    );
  }
);
