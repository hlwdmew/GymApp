
"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Image as ImageIcon, Pin } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AdminNewsPage() {
  const { news, addNews, deleteNews } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
  });

  const handleAddPost = () => {
    if (!formData.title || !formData.content) {
      toast({ title: "Ошибка", description: "Заполните заголовок и содержание", variant: "destructive" });
      return;
    }

    const newPost = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      content: formData.content,
      image: formData.image || `https://picsum.photos/seed/${Math.random()}/1200/600`,
      author: "Администратор",
      date: "Только что",
      likes: 0,
      comments: [],
      pinned: false
    };

    addNews(newPost);
    setIsAdding(false);
    setFormData({ title: "", content: "", image: "" });
    toast({ title: "Успех", description: "Новость опубликована в ленте" });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-headline font-bold">Управление лентой</h1>
          <p className="text-muted-foreground">Создавайте объявления и делитесь успехами клуба.</p>
        </div>
        
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-white text-black font-bold h-12 px-6">
              <Plus className="w-4 h-4 mr-2" /> Добавить новость
            </Button>
          </DialogTrigger>
          <DialogContent className="apple-glass border-none sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline font-bold">Новая публикация</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Заголовок</label>
                <Input 
                  placeholder="Заголовок новости" 
                  className="glass border-none h-12 rounded-xl"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Содержание</label>
                <Textarea 
                  placeholder="О чем хотите рассказать?" 
                  className="glass border-none min-h-[150px] rounded-xl resize-none"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Ссылка на изображение</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="https://..." 
                    className="glass border-none h-12 rounded-xl"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                  />
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/10 glass">
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsAdding(false)} className="rounded-xl">Отмена</Button>
              <Button onClick={handleAddPost} className="bg-white text-black font-bold rounded-xl px-8 h-12">Опубликовать</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="apple-glass rounded-3xl overflow-hidden border-none shadow-xl">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="p-6 font-bold uppercase text-[10px] tracking-widest">Новость</TableHead>
              <TableHead className="p-6 font-bold uppercase text-[10px] tracking-widest">Дата</TableHead>
              <TableHead className="p-6 font-bold uppercase text-[10px] tracking-widest text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.map((item) => (
              <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="p-6">
                  <div className="flex items-center gap-2">
                    {item.pinned && <Pin className="w-3 h-3 text-primary" />}
                    <span className="font-bold">{item.title}</span>
                  </div>
                </TableCell>
                <TableCell className="p-6 text-muted-foreground">{item.date}</TableCell>
                <TableCell className="p-6 text-right">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => deleteNews(item.id)}
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
