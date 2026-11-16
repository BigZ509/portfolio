import type { ReactNode } from "react";

type DecorativeFrameProps = {
  children: ReactNode;
  className?: string;
};

export function DecorativeFrame({ children, className = "" }: DecorativeFrameProps) {
  return (
    <div className={`decorative-frame ${className}`}>
      {children}
    </div>
  );
}
