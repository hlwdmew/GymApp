
"use client";

import { Search, LogOut, ShieldCheck, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { signOut } from "firebase/auth";
import { useAuth } from "@/firebase";

export function TopNavbar() {
  const { role, setRole, displayName, setDisplayName } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      setRole("user");
      setDisplayName("Атлет");
      toast({ title: "Вы вышли", description: "Ждем вас снова!" });
      router.push("/login");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-40 w-full apple-glass px-8 h-20 flex items-center justify-between">
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-white" />
          <Input 
            placeholder="Поиск..." 
            className="pl-12 bg-white/5 border-none focus-visible:ring-1 focus-visible:ring-white/20 rounded-2xl h-11 placeholder:text-muted-foreground text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-11 w-11 rounded-full p-0 border border-white/10 hover:border-white/20 transition-all">
              <Avatar className="h-full w-full">
                <AvatarImage src={`https://picsum.photos/seed/${displayName}/100/100`} alt="Avatar" />
                <AvatarFallback className="bg-white text-black font-bold">
                  {displayName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 apple-glass p-2 mt-2 border-white/10" align="end" forceMount>
            <DropdownMenuLabel className="font-normal px-4 py-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none text-white">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground mt-1 uppercase tracking-wider font-bold">
                  {role === 'admin' ? 'Администратор' : 'Атлет'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5 mx-2" />
            <div className="p-1">
              <DropdownMenuItem 
                className="rounded-lg px-4 py-2.5 cursor-pointer focus:bg-white focus:text-black transition-colors"
                onClick={() => router.push("/profile")}
              >
                <Settings className="mr-3 h-4 w-4" />
                <span className="font-medium">Профиль</span>
              </DropdownMenuItem>
              
              {role === 'admin' && (
                <DropdownMenuItem 
                  className="rounded-lg px-4 py-2.5 cursor-pointer focus:bg-white focus:text-black transition-colors"
                  onClick={() => router.push("/admin")}
                >
                  <ShieldCheck className="mr-3 h-4 w-4" />
                  <span className="font-medium">Админ-панель</span>
                </DropdownMenuItem>
              )}
            </div>
            <DropdownMenuSeparator className="bg-white/5 mx-2" />
            <div className="p-1">
              <DropdownMenuItem 
                className="rounded-lg px-4 py-2.5 cursor-pointer text-destructive focus:bg-destructive focus:text-white transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span className="font-medium">Выйти</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
