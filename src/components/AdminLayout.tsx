"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, CalendarClock, Users, LogOut, ExternalLink, Gamepad2, FileText, Tags } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/slots", icon: CalendarClock, label: "Zeitslots" },
  { href: "/admin/kategorien", icon: Tags, label: "Kurskategorien" },
  { href: "/admin/buchungen", icon: Users, label: "Buchungen" },
  { href: "/admin/formular", icon: FileText, label: "Buchungsformular" },
  { href: "/admin/silbenspiel", icon: Gamepad2, label: "Silbenspiel" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#f4f6f5", fontFamily: "var(--font-raleway), sans-serif" }}>

      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: "#fff",
        borderRight: "1px solid #e8eceb",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #e8eceb" }}>
          <p style={{ fontSize: 16, fontWeight: 800, color: "#1a5c4a", margin: 0 }}>Einfach Lernen</p>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0", fontWeight: 500 }}>Admin-Bereich</p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  color: active ? "#1a5c4a" : "#6b7280",
                  background: active ? "#eaf4ef" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.1s",
                }}
              >
                <Icon style={{ width: 16, height: 16 }} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "10px 10px 20px", borderTop: "1px solid #e8eceb", display: "flex", flexDirection: "column", gap: 2 }}>
          <Link
            href="/"
            target="_blank"
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, fontSize: 13, fontWeight: 500, color: "#9ca3af", textDecoration: "none" }}
          >
            <ExternalLink style={{ width: 15, height: 15 }} />
            Buchungsseite
          </Link>
          <button
            onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, fontSize: 13, fontWeight: 500, color: "#9ca3af", background: "none", border: "none", cursor: "pointer", width: "100%", fontFamily: "inherit" }}
          >
            <LogOut style={{ width: 15, height: 15 }} />
            Abmelden
          </button>
        </div>
      </aside>

      {/* Content */}
      <div style={{ marginLeft: 220, flex: 1, minHeight: "100vh" }}>{children}</div>
    </div>
  );
}
