"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "Journeys", href: "/journeys", icon: "📖" },
  { label: "Explore", href: "/explore", icon: "✨" },
];

export function BottomNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav style={{
      position: "fixed",
      bottom: 20,
      left: "50%",
      transform: "translateX(-50%)",
      width: 300,
      background: "rgba(255,255,255,0.96)",
      backdropFilter: "blur(12px)",
      borderRadius: 32,
      boxShadow: "0 4px 24px rgba(100,60,180,0.18)",
      padding: "10px 8px",
      display: "flex",
      justifyContent: "space-around",
      zIndex: 50,
    }}>
      {tabs.map(({ label, href, icon }) => {
        const active = isActive(href);
        return (
          <Link key={href} href={href} style={{ flex: 1, textDecoration: "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{
                width: 48,
                height: 32,
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                background: active ? "linear-gradient(135deg,#7c4fc4,#a389d4)" : "transparent",
                transition: "background 0.2s",
                margin: "0 auto",
              }}>
                {icon}
              </div>
              <span style={{
                fontSize: 11,
                color: active ? "#6a3aaa" : "#9a88b8",
                fontWeight: active ? 700 : 500,
              }}>
                {label}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
