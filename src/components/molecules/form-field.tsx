"use client";

import type { ReactElement, ReactNode } from "react";
import {
  Controller,
  Control,
  FieldValues,
  Path,
  FieldError,
  ControllerRenderProps,
} from "react-hook-form";
import * as LabelPrimitive from "@radix-ui/react-label";

export interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: ReactNode;
  control: Control<T>;
  error?: FieldError;
  render: (field: ControllerRenderProps<T, Path<T>>) => ReactElement;
}

export function FormField<T extends FieldValues>({
  name,
  label,
  control,
  error,
  render,
}: FormFieldProps<T>) {
  const errorId = `${name}-error`;

  return (
    <div className="space-y-2">
      <LabelPrimitive.Root
        htmlFor={name}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </LabelPrimitive.Root>
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          render({
            ...field,
            ...(error
              ? { "aria-invalid": true, "aria-describedby": errorId }
              : {}),
          } as ControllerRenderProps<T, Path<T>>)
        }
      />
      {error?.message && (
        <p id={errorId} className="text-sm font-medium text-destructive">
          {error.message}
        </p>
      )}
    </div>
  );
}
