"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";

const routes = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/resume", label: "Resume" },
] as const;

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-[var(--layer-overlay)] backdrop-blur-md ${styles.navbarBg}`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-lg tracking-[0.12em] text-[var(--color-antique-gold)] no-underline transition-opacity hover:opacity-80"
        >
          MARC&rsquo;S WORLD
        </Link>

        <ul className="flex list-none gap-1 sm:gap-2" role="list">
          {routes.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-block rounded-[var(--radius-sm)] px-2.5 py-1.5 text-sm no-underline transition-colors sm:px-3 sm:text-base ${
                    isActive
                      ? "text-[var(--color-antique-gold)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-ivory)]"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom edge fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgb(201_174_120_/_18%)] to-transparent"
      />
    </nav>
  );
}
