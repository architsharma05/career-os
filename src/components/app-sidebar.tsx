"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  ContactRound,
  FileText,
  LayoutDashboard,
  ListChecks,
  Settings,
  Sparkles,
  Target
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Search Profiles", icon: Target, href: "/search-profiles" },
  { label: "Jobs", icon: BriefcaseBusiness, href: "/jobs" },
  { label: "Companies", icon: Building2, href: "/companies" },
  { label: "Contacts", icon: ContactRound, href: "/contacts" },
  { label: "Resume Profile", icon: FileText, href: "#", disabled: true },
  { label: "Pipeline", icon: ListChecks, href: "#", disabled: true },
  { label: "Reminders", icon: Bell, href: "#", disabled: true },
  { label: "AI Assistant", icon: Sparkles, href: "#", disabled: true },
  { label: "Analytics", icon: BarChart3, href: "#", disabled: true },
  { label: "Settings", icon: Settings, href: "#", disabled: true }
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r bg-card px-4 py-5 lg:block">
      <div className="flex items-center justify-between px-2">
        <div>
          <p className="text-lg font-bold">CareerOS</p>
          <p className="text-xs text-muted-foreground">Demo workspace</p>
        </div>
        <Badge tone="green">Mock AI</Badge>
      </div>

      <nav className="mt-8 space-y-1">
        {nav.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : !item.disabled && pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              aria-disabled={item.disabled}
              className={cn(
                "flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                item.disabled && "pointer-events-none opacity-45"
              )}
              href={item.href}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-lg border bg-accent p-4 text-accent-foreground">
        <p className="text-sm font-semibold">Ethical automation</p>
        <p className="mt-2 text-xs leading-5">
          CareerOS drafts, scores, and organizes. Users review every application and message.
        </p>
      </div>
    </aside>
  );
}

export function AppMobileNav() {
  const pathname = usePathname();
  const availableNav = nav.filter((item) => !item.disabled);

  return (
    <div className="border-b bg-card px-4 py-3 lg:hidden">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-base font-bold">CareerOS</p>
          <p className="text-xs text-muted-foreground">Demo workspace</p>
        </div>
        <Badge tone="green">Mock AI</Badge>
      </div>
      <nav className="flex gap-2 overflow-x-auto pb-1">
        {availableNav.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
              href={item.href}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
