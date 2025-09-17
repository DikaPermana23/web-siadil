import React from "react";

export default function CardShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${className}`}>
      {children}
    </div>
  );
}