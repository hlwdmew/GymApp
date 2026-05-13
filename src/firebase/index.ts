'use client';

import { getApp, getApps, initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

/**
 * Инициализирует Firebase сервисы.
 */
export function initializeFirebase() {
  const isConfigured = !!(
    firebaseConfig.apiKey && 
    firebaseConfig.apiKey !== 'undefined'
  );

  if (!isConfigured) {
    return { 
      firebaseApp: null as any, 
      auth: null as any, 
      firestore: null as any, 
      isConfigured: false 
    };
  }

  try {
    const firebaseApp = getApps().length > 0 
      ? getApp() 
      : initializeApp(firebaseConfig);

    const auth = getAuth(firebaseApp);
    const firestore = getFirestore(firebaseApp);

    return { firebaseApp, auth, firestore, isConfigured: true };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return { 
      firebaseApp: null as any, 
      auth: null as any, 
      firestore: null as any, 
      isConfigured: false 
    };
  }
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
