
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/firebase";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const auth = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast({ 
        variant: "destructive", 
        title: "Сервис недоступен", 
        description: "Firebase не настроен. Проверьте переменные окружения." 
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "С возвращением!", description: "Вы успешно вошли." });
      router.push("/");
    } catch (err: any) {
      setError("Неверный логин или пароль.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="w-full max-w-[400px] space-y-8 animate-in fade-in duration-1000">
        <div className="text-center">
          <h1 className="text-5xl font-headline font-bold tracking-tighter text-white">
            качалка.com
          </h1>
          <p className="text-muted-foreground mt-2 font-medium tracking-wide uppercase text-[10px]">Вход в систему</p>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 rounded-2xl">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="bg-[#0A0A0A] border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
          <form onSubmit={handleLogin}>
            <CardHeader className="pt-10 px-8 text-center border-none bg-transparent">
              <CardTitle className="text-xl text-white font-headline">Авторизация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-8 pb-10">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="ivan@kachalka.com" 
                  required 
                  className="h-12 bg-white/5 border-none rounded-xl px-4 text-white focus-visible:ring-1 focus-visible:ring-white/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  className="h-12 bg-white/5 border-none rounded-xl px-4 text-white focus-visible:ring-1 focus-visible:ring-white/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all mt-6">
                {isLoading ? "Входим..." : "Войти"}
              </Button>
            </CardContent>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Нет аккаунта?{" "}
          <Link href="/register" className="text-white font-bold hover:underline">
            Регистрация
          </Link>
        </p>
      </div>
    </div>
  );
}
