"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const PRODUCTS = [
  { id: '1', name: 'Худи Elite Gym', price: 4500, category: 'Одежда', image: 'https://picsum.photos/seed/hood/400/400', stock: 12 },
  { id: '2', name: 'Сывороточный протеин (2кг)', price: 5900, category: 'Питание', image: 'https://picsum.photos/seed/whey/400/400', stock: 24 },
  { id: '3', name: 'Фитнес-браслет V4', price: 8900, category: 'Аксессуары', image: 'https://picsum.photos/seed/band/400/400', stock: 5 },
  { id: '4', name: 'Спортивное полотенце', price: 1200, category: 'Аксессуары', image: 'https://picsum.photos/seed/towel/400/400', stock: 50 },
  { id: '5', name: 'Боксерские перчатки', price: 6500, category: 'Спорттовары', image: 'https://picsum.photos/seed/boxing/400/400', stock: 8 },
  { id: '6', name: 'Коврик для йоги Pro', price: 3200, category: 'Спорттовары', image: 'https://picsum.photos/seed/yoga/400/400', stock: 15 },
];

const CATEGORIES = ["Все", "Питание", "Одежда", "Аксессуары", "Спорттовары"];

export default function StorePage() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [mounted, setMounted] = useState(false);
  const { role } = useAppStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredProducts = activeCategory === "Все" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    toast({
      title: "Добавлено в корзину",
      description: `${product.name} теперь в вашей сумке.`,
    });
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin opacity-20" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-headline font-bold mb-2">Магазин Zenith</h1>
          <p className="text-muted-foreground">Экипируйтесь официально: одежда и добавки от Zenith Fitness.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Поиск снаряжения..." className="pl-10 glass border-none rounded-xl" />
          </div>
          <Button variant="outline" size="icon" className="rounded-xl glass border-none">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            variant={activeCategory === cat ? "default" : "secondary"}
            className={`rounded-full px-6 whitespace-nowrap ${activeCategory === cat ? 'purple-glow' : 'glass'}`}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="glass border-border/20 rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all">
            <div className="relative aspect-square overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="icon" variant="secondary" className="rounded-full w-8 h-8 glass border-none hover:text-red-500">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              <Badge className="absolute bottom-4 left-4 glass border-none bg-white/10 backdrop-blur-md">
                {product.category}
              </Badge>
            </div>
            <CardContent className="p-5">
              <h3 className="font-headline font-bold text-lg mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-white">{product.price} ₽</p>
                <p className="text-xs text-muted-foreground">{product.stock} в наличии</p>
              </div>
            </CardContent>
            <CardFooter className="p-5 pt-0">
              <Button 
                onClick={() => handleAddToCart(product)}
                className="w-full rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground font-bold transition-all gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                В корзину
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
