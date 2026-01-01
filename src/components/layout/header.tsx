'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

const getTitleFromPathname = (pathname: string) => {
  if (pathname.includes('/tool-suggester')) return 'Tool Suggester';
  if (pathname.includes('/web-summarizer')) return 'Web Summarizer';
  if (pathname.includes('/settings')) return 'Settings';
  return 'Dashboard';
};

export function Header() {
  const pathname = usePathname();
  const title = getTitleFromPathname(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="flex-1 text-lg font-semibold md:text-xl font-headline">{title}</h1>
    </header>
  );
}
