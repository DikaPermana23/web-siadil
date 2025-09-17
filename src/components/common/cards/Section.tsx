// src/components/common/cards/Section.tsx
import React from "react";

type Props = {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  /** kelas tambahan untuk <section> root */
  className?: string;
  /** kelas tambahan untuk <h2> title (mis. translate-y) */
  titleClassName?: string;
};

export default function Section({
  title,
  right,
  children,
  className = "",
  titleClassName = "",
}: Props) {
  return (
    <section className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <h2 className={`text-lg font-semibold ${titleClassName}`}>{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}
