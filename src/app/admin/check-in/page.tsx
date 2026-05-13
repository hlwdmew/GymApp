"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, UserCheck, UserMinus, Clock, QrCode, Scan } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const MEMBERS = [
  { id: 'M001', name: "John Doe", status: "Active", lastVisit: "Yesterday" },
  { id: 'M002', name: "Sarah Chen", status: "Inactive", lastVisit: "1 month ago" },
  { id: 'M003', name: "Alex Rivera", status: "Active", lastVisit: "Today" },
];

export default function CheckInPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleCheckIn = (name: string, type: 'present' | 'late') => {
    toast({
      title: "Check-in successful",
      description: `${name} has been marked as ${type}.`,
    });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold mb-2">Live Check-in</h1>
          <p className="text-muted-foreground">Manage real-time club attendance and member entries.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="glass border-white/10 gap-2 rounded-xl">
            <QrCode className="w-4 h-4" />
            Scanner Mode
          </Button>
          <Button className="bg-secondary text-white font-bold rounded-xl purple-glow gap-2">
            <Scan className="w-4 h-4" />
            Manual Entry
          </Button>
        </div>
      </div>

      <Card className="glass border-border/20 rounded-3xl overflow-hidden p-8">
        <div className="max-w-xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 purple-glow">
              <UserCheck className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-headline font-bold">Search Member</h2>
            <p className="text-muted-foreground">Enter member ID or name for manual check-in</p>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, Name or Email..." 
              className="pl-12 h-14 glass border-none rounded-2xl text-lg focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-4">
            {MEMBERS.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())).map((member) => (
              <div key={member.id} className="p-4 rounded-2xl glass border-border/20 flex items-center justify-between group hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-bold text-primary">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{member.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] uppercase border-white/10">{member.id}</Badge>
                      <span className="text-xs text-muted-foreground">Last: {member.lastVisit}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-emerald-500 hover:bg-emerald-500/10 rounded-lg gap-1"
                    onClick={() => handleCheckIn(member.name, 'present')}
                  >
                    <UserCheck className="w-4 h-4" /> Arrived
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-orange-500 hover:bg-orange-500/10 rounded-lg gap-1"
                    onClick={() => handleCheckIn(member.name, 'late')}
                  >
                    <Clock className="w-4 h-4" /> Late
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-500/10 rounded-lg gap-1">
                    <UserMinus className="w-4 h-4" /> Absent
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}