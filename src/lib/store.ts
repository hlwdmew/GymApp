
"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Workout {
  id: string;
  name: string;
  time: string;
  trainer: string;
  day: string;
  capacity: number;
  enrolled: number;
  color: string;
}

export interface NewsPost {
  id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  date: string;
  likes: number;
  comments: any[];
  pinned: boolean;
  isLiked?: boolean;
}

interface AppState {
  role: 'user' | 'admin' | 'trainer';
  displayName: string;
  workouts: Workout[];
  news: NewsPost[];
  setRole: (role: 'user' | 'admin' | 'trainer') => void;
  setDisplayName: (name: string) => void;
  addWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  addNews: (post: NewsPost) => void;
  deleteNews: (id: string) => void;
  updateWorkoutEnrolled: (id: string, enrolled: number) => void;
  toggleNewsLike: (id: string) => void;
  addNewsComment: (id: string, comment: any) => void;
}

const INITIAL_WORKOUTS: Workout[] = [
  { id: '1', name: "Power HIIT", time: "10:00", trainer: "Алексей Ривера", day: "Понедельник", capacity: 15, enrolled: 12, color: "bg-orange-500" },
  { id: '2', name: "Zen Yoga", time: "11:30", trainer: "Сара Чен", day: "Понедельник", capacity: 20, enrolled: 18, color: "bg-emerald-500" },
  { id: '3', name: "Iron Pump", time: "14:00", trainer: "Дмитрий Петров", day: "Вторник", capacity: 12, enrolled: 5, color: "bg-blue-500" },
];

const INITIAL_NEWS: NewsPost[] = [
  {
    id: '1',
    title: "Новое расписание сауны",
    content: "Со следующего понедельника наши премиальные сауны и хаммам будут открыты с 5:00 утра.",
    image: "https://picsum.photos/seed/sauna/1200/600",
    author: "Администрация",
    date: "2 часа назад",
    likes: 42,
    comments: [],
    pinned: true,
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      role: 'user',
      displayName: 'Атлет',
      workouts: INITIAL_WORKOUTS,
      news: INITIAL_NEWS,
      setRole: (role) => set({ role }),
      setDisplayName: (displayName) => set({ displayName }),
      addWorkout: (workout) => set((state) => ({ workouts: [...state.workouts, workout] })),
      deleteWorkout: (id) => set((state) => ({ workouts: state.workouts.filter(w => w.id !== id) })),
      addNews: (post) => set((state) => ({ news: [post, ...state.news] })),
      deleteNews: (id) => set((state) => ({ news: state.news.filter(n => n.id !== id) })),
      updateWorkoutEnrolled: (id, enrolled) => set((state) => ({
        workouts: state.workouts.map(w => w.id === id ? { ...w, enrolled } : w)
      })),
      toggleNewsLike: (id) => set((state) => ({
        news: state.news.map(n => {
          if (n.id === id) {
            const isLiked = !n.isLiked;
            return { ...n, isLiked, likes: n.likes + (isLiked ? 1 : -1) };
          }
          return n;
        })
      })),
      addNewsComment: (id, comment) => set((state) => ({
        news: state.news.map(n => n.id === id ? { ...n, comments: [...n.comments, comment] } : n)
      })),
    }),
    { name: 'zenith-storage' }
  )
);
