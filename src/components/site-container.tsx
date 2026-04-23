import type { ReactNode } from "react";

type SiteContainerProps = {
  children: ReactNode;
};

export function SiteContainer({ children }: SiteContainerProps) {
  return <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">{children}</div>;
}
