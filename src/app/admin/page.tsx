
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";
import { Users, Activity, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const ATTENDANCE_GROWTH = [
  { month: "Янв", visitors: 1200 },
  { month: "Фев", visitors: 1450 },
  { month: "Мар", visitors: 1380 },
  { month: "Апр", visitors: 1650 },
  { month: "Май", visitors: 1890 },
  { month: "Июн", visitors: 2100 },
];

const DAILY_PEAK = [
  { day: "Пн", count: 120 },
  { day: "Вт", count: 150 },
  { day: "Ср", count: 180 },
  { day: "Чт", count: 160 },
  { day: "Пт", count: 210 },
  { day: "Сб", count: 250 },
  { day: "Вс", count: 190 },
];

const chartConfig = {
  visitors: {
    label: "Посетители",
    color: "hsl(var(--primary))",
  },
  count: {
    label: "Активность",
    color: "hsl(var(--secondary))",
  }
} satisfies ChartConfig;

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold mb-2">Аналитика клуба</h1>
          <p className="text-muted-foreground">Комплексный отчет о посещаемости и активности резидентов.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Всего резидентов", value: "1,245", change: "+5.2%", icon: Users, color: "text-primary" },
          { label: "В зале сейчас", value: "42", change: "Пик", icon: Activity, color: "text-secondary" },
          { label: "Новых за неделю", value: "+18", change: "Рост", icon: TrendingUp, color: "text-emerald-500" },
          { label: "Ср. время", value: "65 мин", change: "-2%", icon: Clock, color: "text-orange-500" },
        ].map((stat, i) => (
          <Card key={i} className="glass border-border/20 rounded-2xl overflow-hidden purple-glow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <Badge className="bg-white/5 border-none text-[10px]">
                  {stat.change}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-headline font-bold">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass border-border/20 rounded-3xl p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl font-headline">Посещаемость по месяцам</CardTitle>
            <CardDescription>Количество уникальных визитов за полгода.</CardDescription>
          </CardHeader>
          <div className="h-[300px] mt-4">
            <ChartContainer config={chartConfig}>
              <AreaChart data={ATTENDANCE_GROWTH}>
                <defs>
                  <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorVis)" strokeWidth={3} />
              </AreaChart>
            </ChartContainer>
          </div>
        </Card>

        <Card className="glass border-border/20 rounded-3xl p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl font-headline">Пиковая нагрузка</CardTitle>
            <CardDescription>Среднее количество человек в зале по дням недели.</CardDescription>
          </CardHeader>
          <div className="h-[300px] mt-4">
            <ChartContainer config={chartConfig}>
              <BarChart data={DAILY_PEAK}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ChartContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
