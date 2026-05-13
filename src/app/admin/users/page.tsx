"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserPlus, CreditCard, Minus, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const MOCK_USERS = [
  { id: '1', name: "Иван Иванов", email: "ivan@kachalka.com", balance: 5000, role: "user" },
  { id: '2', name: "Анна Смирнова", email: "anna@kachalka.com", balance: 1200, role: "user" },
  { id: '3', name: "Дмитрий Петров", email: "dmitry@kachalka.com", balance: 8500, role: "trainer" },
];

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { updateBalance } = useAppStore();

  const handleUpdateBalance = (userId: string, amount: number) => {
    updateBalance(amount);
    toast({
      title: "Баланс обновлен",
      description: `Вы изменили баланс пользователя на ${amount} ₽`,
    });
  };

  const filteredUsers = MOCK_USERS.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-headline font-bold">Управление атлетами</h1>
          <p className="text-muted-foreground">Контроль учетных записей и финансовых операций.</p>
        </div>
        <Button className="rounded-xl bg-white text-black font-bold h-12 px-6">
          <UserPlus className="w-4 h-4 mr-2" /> Добавить атлета
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input 
          placeholder="Поиск по имени или email..." 
          className="pl-12 h-14 apple-glass border-none rounded-2xl text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="apple-glass rounded-3xl overflow-hidden border-none shadow-xl">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="font-bold uppercase text-[10px] tracking-widest p-6">Атлет</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest p-6">Роль</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest p-6 text-center">Баланс</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest p-6 text-right">Управление балансом</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="p-6">
                  <div>
                    <p className="font-bold text-lg">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </TableCell>
                <TableCell className="p-6">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] uppercase font-bold tracking-wider">
                    {user.role}
                  </span>
                </TableCell>
                <TableCell className="p-6 text-center font-bold text-xl">
                  {user.balance.toLocaleString()} ₽
                </TableCell>
                <TableCell className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="rounded-xl border-white/10 hover:bg-red-500/10 hover:text-red-500"
                      onClick={() => handleUpdateBalance(user.id, -500)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="rounded-xl border-white/10 hover:bg-emerald-500/10 hover:text-emerald-500"
                      onClick={() => handleUpdateBalance(user.id, 500)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" className="rounded-xl text-muted-foreground hover:text-white">
                      История
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}