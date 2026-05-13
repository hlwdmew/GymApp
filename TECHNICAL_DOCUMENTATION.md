# Техническая документация — качалка.com

## 1. Обзор системы
качалка.com - это современная ERP-система для управления фитнес-клубом премиум-класса. Платформа объединяет функционал для клиентов (расписание, магазин, персональные планы) и администраторов (аналитика, управление контентом).

## 2. Технологический стек
- **Frontend**: Next.js 15.5 (App Router), React 19, TypeScript.
- **Стилизация**: Tailwind CSS, ShadCN UI (Radix UI).
- **Backend-as-a-Service**: Firebase (Authentication, Firestore).
- **Искусственный интеллект**: Genkit + Google Gemini 2.5 Flash.
- **State Management**: Zustand (с персистентностью в LocalStorage).
- **Графики**: Recharts.

## 3. Архитектура проекта
- `src/app/`: Основные маршруты и страницы приложения.
- `src/ai/`: Логика GenAI (промпты и потоки Genkit для тренировок и питания).
- `src/firebase/`: Конфигурация и React-хуки для работы с базой данных и авторизацией.
- `src/lib/`: Общие библиотеки, утилиты и глобальное хранилище Zustand (`store.ts`).
- `src/components/`: Многоразовые UI-компоненты, разделенные на `ui` (базовые) и `navigation`.

## 4. Схема данных (Firestore)
### Коллекция `users`
- `uid`: string (ID пользователя)
- `email`: string
- `displayName`: string (никнейм)
- `role`: 'user' | 'admin' | 'trainer'
- `createdAt`: timestamp

### Коллекция `news`
- `title`: string
- `content`: string
- `image`: string (URL)
- `likes`: number
- `pinned`: boolean
- `comments`: array<{author, text, date}>

### Коллекция `workouts`
- `name`: string
- `time`: string (HH:MM)
- `day`: string
- `trainer`: string
- `capacity`: number
- `enrolled`: number

## 5. Ролевая модель
- **Атлет (User)**: Просмотр новостей, запись на тренировки, покупка в магазине, личные заметки.
- **Администратор (Admin)**: Доступ к `/admin`. Управление расписанием, публикация новостей, просмотр аналитики посещаемости.

## 6. Развертывание
Проект готов к деплою на **Firebase App Hosting** или **Vercel**. 
Основные настройки сборки: `npm run build`. 
Переменные окружения должны содержать ключи Firebase из `src/firebase/config.ts`.
