import { AppMobileNav, AppSidebar } from "@/components/app-sidebar";

type PageShellProps = {
  children: React.ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <main className="flex min-h-screen">
      <AppSidebar />
      <section className="min-w-0 flex-1">
        <AppMobileNav />
        {children}
      </section>
    </main>
  );
}
