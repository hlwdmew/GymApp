
"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Clock, User, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AdminWorkoutsPage() {
  const { workouts, addWorkout, deleteWorkout } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    time: "",
    trainer: "",
    day: "Понедельник",
    capacity: "15"
  });

  const handleAddWorkout = () => {
    if (!formData.name || !formData.time || !formData.trainer) {
      toast({ title: "Ошибка", description: "Заполните все поля", variant: "destructive" });
      return;
    }

    const newWorkout = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      time: formData.time,
      trainer: formData.trainer,
      day: formData.day,
      capacity: parseInt(formData.capacity),
      enrolled: 0,
      color: "bg-primary"
    };

    addWorkout(newWorkout);
    setIsAdding(false);
    setFormData({ name: "", time: "", trainer: "", day: "Понедельник", capacity: "15" });
    toast({ title: "Добавлено", description: "Тренировка добавлена в расписание" });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-headline font-bold">Управление расписанием</h1>
          <p className="text-muted-foreground">Назначайте время, тренеров и управляйте загрузкой залов.</p>
        </div>

        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-white text-black font-bold h-12 px-6">
              <Plus className="w-4 h-4 mr-2" /> Создать занятие
            </Button>
          </DialogTrigger>
          <DialogContent className="apple-glass border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline font-bold">Новая тренировка</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Название</label>
                  <Input 
                    placeholder="Напр. Crossfit" 
                    className="glass border-none h-12 rounded-xl"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Время</label>
                  <Input 
                    type="time" 
                    className="glass border-none h-12 rounded-xl"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Тренер</label>
                <Input 
                  placeholder="Имя тренера" 
                  className="glass border-none h-12 rounded-xl"
                  value={formData.trainer}
                  onChange={(e) => setFormData({...formData, trainer: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">День недели</label>
                  <Select 
                    value={formData.day} 
                    onValueChange={(v) => setFormData({...formData, day: v})}
                  >
                    <SelectTrigger className="glass border-none h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="apple-glass border-none">
                      {["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"].map(d => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Лимит мест</label>
                  <Input 
                    type="number" 
                    className="glass border-none h-12 rounded-xl"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsAdding(false)} className="rounded-xl">Отмена</Button>
              <Button onClick={handleAddWorkout} className="bg-white text-black font-bold rounded-xl px-8 h-12">Добавить</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="apple-glass rounded-3xl overflow-hidden border-none shadow-2xl">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="p-6 font-bold uppercase text-[10px] tracking-widest">Тренировка</TableHead>
              <TableHead className="p-6 font-bold uppercase text-[10px] tracking-widest">День и время</TableHead>
              <TableHead className="p-6 font-bold uppercase text-[10px] tracking-widest">Тренер</TableHead>
              <TableHead className="p-6 font-bold uppercase text-[10px] tracking-widest text-center">Занято</TableHead>
              <TableHead className="p-6 font-bold uppercase text-[10px] tracking-widest text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workouts.map((w) => (
              <TableRow key={w.id} className="border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="p-6">
                  <span className="font-bold text-lg">{w.name}</span>
                </TableCell>
                <TableCell className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {w.day}, {w.time}
                  </div>
                </TableCell>
                <TableCell className="p-6 text-muted-foreground">{w.trainer}</TableCell>
                <TableCell className="p-6 text-center">
                  {w.enrolled} / {w.capacity}
                </TableCell>
                <TableCell className="p-6 text-right">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => deleteWorkout(w.id)}
                    className="text-muted-foreground hover:text-red-500 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
