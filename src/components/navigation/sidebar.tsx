"use client";

import { 
  LayoutDashboard, 
  Dumbbell, 
  Newspaper, 
  Zap,
  Circle,
  CalendarDays,
  FilePlus
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useAppStore } from "@/lib/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function AppSidebar() {
  const { role } = useAppStore();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const userLinks = [
    { name: "Обзор", icon: LayoutDashboard, href: "/" },
    { name: "Зал", icon: Dumbbell, href: "/workouts" },
    { name: "Лента", icon: Newspaper, href: "/news" },
  ];

  const adminLinks = [
    { name: "Аналитика", icon: Zap, href: "/admin" },
    { name: "Управление залом", icon: CalendarDays, href: "/admin/workouts" },
    { name: "Управление лентой", icon: FilePlus, href: "/admin/news" },
  ];

  return (
    <Sidebar className="border-r border-white/5 apple-glass">
      <SidebarHeader className="p-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
            <Circle className="text-black fill-current w-4 h-4" />
          </div>
          <span className="text-xl font-headline font-bold tracking-tighter">
            качалка<span className="text-muted-foreground">.com</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {userLinks.map((link) => (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === link.href}
                  className={cn(
                    "rounded-xl py-6 px-4 transition-all duration-300",
                    pathname === link.href ? "bg-white text-black hover:bg-white" : "hover:bg-white/5"
                  )}
                >
                  <Link href={link.href}>
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {role === 'admin' && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="px-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Админ-панель</SidebarGroupLabel>
            <SidebarMenu className="gap-2">
              {adminLinks.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === link.href}
                    className={cn(
                      "rounded-xl py-6 px-4 transition-all duration-300",
                      pathname === link.href ? "bg-white/10 text-white" : "hover:bg-white/5 text-muted-foreground hover:text-white"
                    )}
                  >
                    <Link href={link.href}>
                      <link.icon className="w-5 h-5" />
                      <span className="font-medium">{link.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
