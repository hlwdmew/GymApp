'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useFirebase } from '../provider';

export function useUser() {
  const { auth, isConfigured } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConfigured || !auth) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Auth state listener error:", error);
      setLoading(false);
    }
  }, [auth, isConfigured]);

  return { user, loading };
}
