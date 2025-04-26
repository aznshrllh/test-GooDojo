"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getPageTitle } from "@/config/navigation";

export function PageHeader() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-lg font-semibold">{pageTitle}</h1>
      </div>
      <div className="text-sm text-muted-foreground hidden md:block">
        GooDojo HR Platform
      </div>
    </header>
  );
}
