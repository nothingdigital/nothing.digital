"use client";

import {
  Controller,
  Control,
  FieldValues,
  Path,
  FieldError,
  ControllerRenderProps,
} from "react-hook-form";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

export interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  error?: FieldError;
  render: (field: ControllerRenderProps<T, Path<T>>) => React.ReactElement;
  className?: string;
}

export function FormField<T extends FieldValues>({
  name,
  label,
  control,
  error,
  render,
  className,
}: FormFieldProps<T>) {
  return (
    <div className={cn("space-y-2", className)}>
      <LabelPrimitive.Root
        htmlFor={name}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </LabelPrimitive.Root>
      <Controller
        name={name}
        control={control}
        render={({ field }) => render(field)}
      />
      {error?.message && (
        <p className="text-sm font-medium text-destructive">{error.message}</p>
      )}
    </div>
  );
}
