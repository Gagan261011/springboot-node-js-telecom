"use client";

import { ReactNode } from "react";

interface AlertProps {
  children: ReactNode;
  variant?: "info" | "success" | "error";
}

const colors = {
  info: "bg-blue-50 text-blue-700 border-blue-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  error: "bg-rose-50 text-rose-700 border-rose-200"
};

export default function Alert({ children, variant = "info" }: AlertProps) {
  return (
    <div className={`border rounded-md px-4 py-3 text-sm ${colors[variant]}`}>
      {children}
    </div>
  );
}
