import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type ButtonHTMLAttributes, type SelectHTMLAttributes } from "react";
import type React from "react";

const inputCls =
  "w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-wizard-500 focus:outline-none focus:ring-1 focus:ring-wizard-500 disabled:opacity-50";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input(props, ref) {
    return <input ref={ref} {...props} className={`${inputCls} ${props.className ?? ""}`} />;
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea(props, ref) {
    return <textarea ref={ref} {...props} className={`${inputCls} ${props.className ?? ""}`} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select(props, ref) {
    return <select ref={ref} {...props} className={`${inputCls} ${props.className ?? ""}`} />;
  },
);

export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-stone-700 mb-1">
      {children}
    </label>
  );
}

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "purple";

const variantCls: Record<ButtonVariant, string> = {
  primary: "bg-wizard-600 text-white hover:bg-wizard-700 disabled:bg-wizard-600/60",
  secondary: "border border-stone-300 bg-white text-stone-800 hover:bg-stone-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-stone-700 hover:bg-stone-100",
  purple: "bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-600/60",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }
>(function Button({ variant = "primary", className = "", ...props }, ref) {
  return (
    <button
      ref={ref}
      {...props}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed ${variantCls[variant]} ${className}`}
    />
  );
});

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-stone-200 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white p-12 text-center text-sm text-stone-500">
      {children}
    </div>
  );
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "active" | "draft" | "done" | "cancel"; children: React.ReactNode }) {
  const tones: Record<string, string> = {
    neutral: "bg-stone-100 text-stone-700",
    active: "bg-emerald-100 text-emerald-800",
    draft: "bg-amber-100 text-amber-800",
    done: "bg-wizard-100 text-wizard-700",
    cancel: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
