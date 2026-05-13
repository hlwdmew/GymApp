'use client';

import React, { createContext, useContext } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { ShieldAlert } from 'lucide-react';

interface FirebaseContextProps {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  isConfigured: boolean;
}

const FirebaseContext = createContext<FirebaseContextProps | undefined>(undefined);

export const FirebaseProvider: React.FC<{
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  isConfigured?: boolean;
  children: React.ReactNode;
}> = ({ firebaseApp, firestore, auth, isConfigured = true, children }) => {
  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-headline font-bold text-white mb-2">Конфигурация не найдена</h1>
        <p className="text-muted-foreground max-w-md">
          Сервисы Firebase недоступны. Пожалуйста, добавьте ключи API в настройки проекта (Project Settings &gt; Environment Variables) и убедитесь, что Authentication включен в консоли Firebase.
        </p>
      </div>
    );
  }

  return (
    <FirebaseContext.Provider value={{ firebaseApp, firestore, auth, isConfigured }}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useFirebaseApp = () => useFirebase().firebaseApp;
export const useFirestore = () => useFirebase().firestore;
export const useAuth = () => useFirebase().auth;
