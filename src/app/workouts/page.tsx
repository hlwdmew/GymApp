
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Users, CheckCircle2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";

export default function WorkoutsPage() {
  const { workouts, updateWorkoutEnrolled } = useAppStore();
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEnroll = (workoutId: string) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return;

    if (enrolledIds.includes(workoutId)) {
      setEnrolledIds(prev => prev.filter(id => id !== workoutId));
      updateWorkoutEnrolled(workoutId, Math.max(0, workout.enrolled - 1));
      toast({ title: "Запись отменена", description: `Вы выписались из группы ${workout.name}.` });
    } else {
      if (workout.enrolled >= workout.capacity) {
        toast({ title: "Группа полна", description: "К сожалению, свободных мест больше нет.", variant: "destructive" });
        return;
      }
      setEnrolledIds(prev => [...prev, workoutId]);
      updateWorkoutEnrolled(workoutId, workout.enrolled + 1);
      toast({ title: "Успешная запись!", description: `Ждем вас на тренировке ${workout.name} в ${workout.time}.` });
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin opacity-20" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-headline font-bold mb-2">Расписание занятий</h1>
        <p className="text-muted-foreground">Выбирайте удобное время и бронируйте место в группе.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {workouts.map((workout) => (
          <Card key={workout.id} className="apple-card rounded-[2.5rem] overflow-hidden group">
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-8 w-full">
                <div className={`w-3 h-20 rounded-full ${workout.color} opacity-30 group-hover:opacity-100 transition-opacity`} />
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-headline font-bold">{workout.name}</h2>
                    {enrolledIds.includes(workout.id) && (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-none gap-1 py-1">
                        <CheckCircle2 className="w-3 h-3" /> Вы записаны
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" /> {workout.day}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" /> {workout.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" /> {workout.enrolled}/{workout.capacity} мест
                    </div>
                  </div>
                  <p className="text-sm font-medium text-white/70">Тренер: {workout.trainer}</p>
                </div>
              </div>
              
              <Button 
                onClick={() => handleEnroll(workout.id)}
                variant={enrolledIds.includes(workout.id) ? "outline" : "default"}
                className={`w-full md:w-48 h-14 rounded-2xl font-bold transition-all ${
                  enrolledIds.includes(workout.id) 
                  ? "border-white/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20" 
                  : "bg-white text-black hover:bg-white/90"
                }`}
              >
                {enrolledIds.includes(workout.id) ? "Отменить запись" : "Записаться"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
