
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth, useFirestore } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;
      const role = formData.email.includes("admin") ? "admin" : "user";

      const userDoc = {
        uid: user.uid,
        email: formData.email,
        displayName: formData.nickname || "Атлет",
        role: role,
        photoURL: `https://picsum.photos/seed/${formData.nickname}/200/200`,
        createdAt: serverTimestamp(),
      };

      setDoc(doc(db, "users", user.uid), userDoc)
        .catch(async (err) => {
          const permissionError = new FirestorePermissionError({
            path: `users/${user.uid}`,
            operation: 'create',
            requestResourceData: userDoc
          });
          errorEmitter.emit('permission-error', permissionError);
        });

      toast({ title: "Успех!", description: `Добро пожаловать в качалка.com!` });
      router.push("/");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Ошибка", description: error.message });
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
          <p className="text-muted-foreground mt-2 font-medium tracking-wide uppercase text-[10px]">Создание профиля</p>
        </div>

        <Card className="bg-[#0A0A0A] border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
          <form onSubmit={handleRegister}>
            <CardHeader className="pt-10 px-8 text-center border-none bg-transparent">
              <CardTitle className="text-xl text-white font-headline">Регистрация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-8 pb-10">
              <div className="space-y-2">
                <Label htmlFor="nickname">Ваш никнейм</Label>
                <Input 
                  id="nickname" 
                  placeholder="GymHero" 
                  required 
                  className="h-12 bg-white/5 border-none rounded-xl px-4 text-white focus-visible:ring-1 focus-visible:ring-white/20"
                  value={formData.nickname}
                  onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="ivan@kachalka.com" 
                  required 
                  className="h-12 bg-white/5 border-none rounded-xl px-4 text-white focus-visible:ring-1 focus-visible:ring-white/20"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all mt-8">
                {isLoading ? "Регистрируем..." : "Зарегистрироваться"}
              </Button>
            </CardContent>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-white font-bold hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
