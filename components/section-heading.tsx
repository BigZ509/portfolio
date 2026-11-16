import type { ReactNode } from "react";

type SectionHeadingProps = {
  children: ReactNode;
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeading({ children, as: Tag = "h2", className = "" }: SectionHeadingProps) {
  return (
    <Tag className={`font-[family-name:var(--font-display)] font-normal leading-[1.05] text-[var(--color-ivory)] ${className}`}>
      {children}
    </Tag>
  );
}
