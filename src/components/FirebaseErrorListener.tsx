'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { toast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  useEffect(() => {
    const handlePermissionError = (error: any) => {
      // Централизованная обработка ошибок безопасности
      // В режиме разработки Next.js покажет оверлей при выбросе исключения
      toast({
        variant: "destructive",
        title: "Ошибка доступа",
        description: "У вас недостаточно прав для выполнения этого действия в базе данных.",
      });
      
      // Выбрасываем ошибку, чтобы она была видна в консоли и оверлее
      if (process.env.NODE_ENV === 'development') {
        throw error;
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => errorEmitter.off('permission-error', handlePermissionError);
  }, []);

  return null;
}
