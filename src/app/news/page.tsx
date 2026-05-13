
"use client";

import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, MoreHorizontal, Pin, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function NewsPage() {
  const { role, displayName, news, toggleNewsLike, addNewsComment } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;

    addNewsComment(postId, {
      author: displayName,
      text: commentText,
      date: "Только что"
    });

    setCommentText("");
    toast({
      title: "Комментарий добавлен",
      description: "Ваше мнение важно для нас!",
    });
  };

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-headline font-bold mb-2">Лента клуба</h1>
          <p className="text-muted-foreground">Последние новости и события нашего сообщества.</p>
        </div>
      </div>

      <div className="space-y-12">
        {news.map((post) => (
          <Card key={post.id} className="glass border-border/20 rounded-[2.5rem] overflow-hidden purple-glow hover:border-primary/30 transition-all">
            <CardHeader className="p-8 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border border-white/10">
                  <AvatarImage src={`https://picsum.photos/seed/auth${post.id}/100/100`} />
                  <AvatarFallback>{post.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-base">{post.author}</p>
                    {post.pinned && (
                      <Badge className="bg-primary/20 text-primary border-none text-[10px] h-5 gap-1 px-2 rounded-full">
                        <Pin className="w-3 h-3" /> Закреплено
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{post.date}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full hover:bg-white/5">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </CardHeader>

            <div className="px-8 pb-6">
              <h2 className="text-3xl font-headline font-bold mb-4">{post.title}</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{post.content}</p>
            </div>

            <div className="aspect-[2/1] overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>

            <CardFooter className="p-6 border-t border-white/5 flex flex-col gap-6">
              <div className="flex items-center gap-8 w-full">
                <button 
                  onClick={() => toggleNewsLike(post.id)}
                  className={cn(
                    "flex items-center gap-2 transition-all duration-300 transform active:scale-125",
                    post.isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                  )}
                >
                  <Heart className={cn("w-6 h-6", post.isLiked && "fill-current")} />
                  <span className="text-sm font-bold">{post.likes}</span>
                </button>
                <button 
                  onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-blue-400 transition-colors"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-sm font-bold">{post.comments.length}</span>
                </button>
                <button className="ml-auto text-muted-foreground hover:text-white transition-colors">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              {activeCommentId === post.id && (
                <div className="w-full space-y-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-4">
                    {post.comments.map((comment, i) => (
                      <div key={i} className="flex gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarFallback className="text-[10px]">{comment.author.substring(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-bold text-white/90">{comment.author}</p>
                          <p className="text-sm text-muted-foreground mt-1">{comment.text}</p>
                          <p className="text-[10px] text-white/20 mt-2">{comment.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Avatar className="w-10 h-10 shrink-0 border border-white/10">
                      <AvatarImage src={`https://picsum.photos/seed/${displayName}/100/100`} />
                      <AvatarFallback>{displayName.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="relative flex-1">
                      <Input 
                        placeholder="Написать комментарий..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                        className="h-12 bg-white/5 border-none rounded-2xl pr-12 text-sm focus-visible:ring-1 focus-visible:ring-white/20"
                      />
                      <Button 
                        size="icon"
                        variant="ghost"
                        onClick={() => handleAddComment(post.id)}
                        className="absolute right-1 top-1 h-10 w-10 text-primary hover:bg-transparent"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
