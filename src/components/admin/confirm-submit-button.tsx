"use client";

import { Button } from "@/components/ui/button";

export function ConfirmSubmitButton({
  children,
  message,
  variant = "destructive",
  size = "sm",
}: {
  children: React.ReactNode;
  message: string;
  variant?: "destructive" | "outline" | "secondary" | "default" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}) {
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </Button>
  );
}
