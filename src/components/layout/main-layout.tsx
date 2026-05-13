"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { AppSidebar } from "@/components/navigation/sidebar";
import { TopNavbar } from "@/components/navigation/navbar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useUser, useFirestore } from "@/firebase";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const { setRole, setDisplayName } = useAppStore();
  const [isReady, setIsReady] = useState(false);

  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    if (!loading) {
      if (!user && !isAuthPage) {
        router.push("/login");
      } else if (user && isAuthPage) {
        router.push("/");
      } else {
        if (user && db) {
          // Слушатель профиля в реальном времени
          unsubscribeProfile = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data.role) setRole(data.role);
              if (data.displayName) setDisplayName(data.displayName);
            }
          });
        }
        setIsReady(true);
      }
    }

    return () => {
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, [user, loading, isAuthPage, router, db, setRole, setDisplayName]);

  if (loading || (!isReady && !isAuthPage)) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-white animate-spin opacity-20" />
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest animate-pulse">качалка.com</p>
        </div>
      </div>
    );
  }

  if (isAuthPage && !user) {
    return <div className="min-h-screen w-full bg-black">{children}</div>;
  }

  if (!user && !isAuthPage) return null;

  return (
    <div className="flex min-h-screen w-full bg-black">
      <AppSidebar />
      <SidebarInset className="bg-transparent">
        <TopNavbar />
        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </SidebarInset>
    </div>
  );
}
