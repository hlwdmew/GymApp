"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Activity, Flame, ChevronRight, Plus, ArrowUpRight, Save, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";
import Link from "next/link";

export default function Home() {
  const { displayName } = useAppStore();
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSaveNote = () => {
    if (!note.trim()) return;
    setSavedNotes([...savedNotes, note]);
    setNote("");
    toast({
      title: "Заметка сохранена",
      description: "Ваш план тренировки успешно добавлен.",
    });
  };

  const handleDeleteNote = (index: number) => {
    setSavedNotes(savedNotes.filter((_, i) => i !== index));
    toast({
      title: "Заметка удалена",
      variant: "destructive",
    });
  };

  const stats = [
    { label: "Энергия", value: "2,450 ккал", icon: Flame },
    { label: "Активность", value: "12 тренировок", icon: Activity },
    { label: "Прогресс", value: "78%", icon: TrendingUp },
  ];

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-headline font-bold tracking-tighter text-white">Привет, {displayName}.</h1>
          <p className="text-xl text-muted-foreground font-light">Твой прогресс за неделю вырос на 12%. Продолжай в том же духе.</p>
        </div>
        <Button asChild className="rounded-2xl px-8 h-14 bg-white text-black hover:bg-white/90 text-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95">
          <Link href="/workouts">
            <Plus className="w-5 h-5 mr-2" />
            Новая тренировка
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={stat.label} className="apple-card rounded-[2.5rem] p-4 group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 rounded-2xl bg-white/5 transition-transform duration-500 group-hover:scale-110">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1 uppercase tracking-widest">{stat.label}</p>
                <p className="text-4xl font-headline font-bold tracking-tighter text-white">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-3xl font-headline font-bold tracking-tight text-white">Мой план тренировки</h2>
            <Badge variant="outline" className="rounded-full border-white/10 px-4 py-1">Персональные заметки</Badge>
          </div>

          <Card className="apple-card rounded-[3rem] overflow-hidden border-none shadow-2xl p-8">
            <div className="space-y-6">
              <Textarea 
                placeholder="Напишите упражнения, подходы и повторения на сегодня..." 
                className="min-h-[150px] bg-white/5 border-none rounded-2xl text-lg resize-none focus-visible:ring-1 focus-visible:ring-white/20 text-white"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Button 
                onClick={handleSaveNote}
                className="w-full h-14 rounded-2xl bg-white text-black hover:bg-white/90 font-bold transition-all"
              >
                <Save className="w-5 h-5 mr-2" />
                Сохранить план
              </Button>
            </div>

            {savedNotes.length > 0 && (
              <div className="mt-12 space-y-4">
                <h3 className="text-xl font-headline font-bold text-white">Сохраненные планы:</h3>
                {savedNotes.map((n, i) => (
                  <div key={i} className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex justify-between items-start group">
                    <div className="whitespace-pre-wrap text-muted-foreground">{n}</div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteNote(i)}
                      className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-10">
          <h2 className="text-2xl font-headline font-bold border-b border-white/5 pb-4 tracking-tight text-white">Расписание</h2>
          <div className="space-y-4">
            {[
              { name: "Power HIIT", time: "10:00", trainer: "Алексей Ривера", color: "bg-orange-500" },
              { name: "Zen Yoga", time: "11:30", trainer: "Сара Чен", color: "bg-emerald-500" },
              { name: "Iron Pump", time: "14:00", trainer: "Дмитрий Петров", color: "bg-blue-500" },
            ].map((cls, i) => (
              <div key={i} className="apple-card p-5 rounded-3xl flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-5">
                  <div className={`w-2 h-10 rounded-full ${cls.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                  <div>
                    <p className="font-bold text-base mb-1 tracking-tight text-white">{cls.name}</p>
                    <p className="text-xs text-muted-foreground font-medium">{cls.trainer} • {cls.time}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-white transition-all transform group-hover:translate-x-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
