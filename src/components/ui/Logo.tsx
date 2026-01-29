import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-auto",
    md: "h-10 w-auto",
    lg: "h-14 w-auto",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Logo placeholder container - swappable */}
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-gradient-primary",
          sizeClasses[size]
        )}
      >
        {/* Placeholder for uploaded logo */}
        <img
          src="/favicon.ico"
          alt="Newomen"
          className={cn("object-contain", sizeClasses[size])}
        />
      </div>
      <span className={cn(
        "font-display font-bold text-gradient-primary",
        size === "sm" && "text-lg",
        size === "md" && "text-xl",
        size === "lg" && "text-2xl"
      )}>
        Newomen
      </span>
    </div>
  );
}
