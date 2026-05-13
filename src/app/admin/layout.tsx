
"use client";

import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { role } = useAppStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (role !== "admin") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-headline font-bold">Доступ ограничен</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            У вас нет прав администратора для просмотра этого раздела. Пожалуйста, вернитесь на главную или смените роль в профиле.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-xl h-12 px-8 border-white/10 glass">
          <Link href="/">Вернуться на главную</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
