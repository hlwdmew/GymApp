"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { User, Check, Loader2, Shield } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { useFirestore, useUser } from "@/firebase";

export default function ProfilePage() {
  const { displayName, setDisplayName, role, setRole } = useAppStore();
  const { user } = useUser();
  const db = useFirestore();
  
  const [newName, setNewName] = useState(displayName);
  const [newRole, setNewRole] = useState(role);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNewName(displayName);
    setNewRole(role);
  }, [displayName, role]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast({ title: "Ошибка", description: "Никнейм не может быть пустым", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    
    try {
      if (user && db) {
        // Используем setDoc с merge: true для большей надежности (создаст если нет, обновит если есть)
        await setDoc(doc(db, "users", user.uid), {
          displayName: newName,
          role: newRole
        }, { merge: true });
      }
      
      // Локальное обновление для мгновенного фидбека (MainLayout подхватит остальное)
      setDisplayName(newName);
      setRole(newRole as any);
      
      toast({
        title: "Профиль обновлен",
        description: "Ваши данные успешно сохранены.",
      });
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast({ 
        title: "Ошибка", 
        description: error.message || "Не удалось сохранить данные", 
        variant: "destructive" 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-headline font-bold text-white mb-2">Настройки профиля</h1>
        <p className="text-muted-foreground">Управляйте вашим никнеймом и персональными данными.</p>
      </div>

      <Card className="apple-glass border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-white/5 text-center">
          <div className="relative inline-block mx-auto mb-6">
            <Avatar className="w-24 h-24 border-2 border-white/10">
              <AvatarImage src={`https://picsum.photos/seed/${displayName}/200/200`} />
              <AvatarFallback className="bg-white text-black text-2xl font-bold">
                {displayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full text-primary-foreground border-2 border-background">
              <User className="w-4 h-4" />
            </div>
          </div>
          <CardTitle className="text-2xl font-headline text-white">Персональная информация</CardTitle>
          <CardDescription>Изменения вступят в силу немедленно.</CardDescription>
        </CardHeader>
        
        <CardContent className="p-10">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-white ml-1">Никнейм</Label>
              <Input 
                id="nickname" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="h-14 glass border-none rounded-2xl px-6 text-lg text-white focus-visible:ring-1 focus-visible:ring-white/20"
                placeholder="Напр. GymHero99"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-white ml-1">Роль (тестирование)</Label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as any)}>
                <SelectTrigger className="h-14 glass border-none rounded-2xl px-6 text-lg text-white focus:ring-1 focus:ring-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="apple-glass border-none">
                  <SelectItem value="user">Атлет</SelectItem>
                  <SelectItem value="admin">Администратор</SelectItem>
                  <SelectItem value="trainer">Тренер</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1 px-1">
                <Shield className="w-3 h-3" /> Переключение роли меняет доступные разделы меню.
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={isSaving || (newName === displayName && newRole === role)}
              className="w-full h-14 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Сохранить изменения
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
