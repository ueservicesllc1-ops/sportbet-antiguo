
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from './skeleton';

export function UserBalanceDisplay() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const userDocRef = doc(db, 'users', user.uid);

      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setBalance(userData.balance);
        } else {
          setBalance(0); // User document doesn't exist
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching balance:", error);
        setBalance(0);
        setLoading(false);
      });

      // Cleanup subscription on component unmount
      return () => unsubscribe();
    } else {
      // No user logged in
      setBalance(null);
      setLoading(false);
    }
  }, [user]);

  // Don't render anything if the user is not logged in
  if (!user) {
    return null;
  }

  // Show a loading skeleton while fetching the balance
  if (loading) {
    return (
      <div className="my-4 p-4 border rounded-lg bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-400">Cargando tu saldo...</p>
          <Skeleton className="h-8 w-32 mt-1 bg-gray-700" />
        </div>
      </div>
    );
  }

  return (
    <div className="my-4 p-6 border-2 border-primary-foreground rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-300">Tu Saldo Actual</p>
        <p className="text-4xl font-bold tracking-tight text-primary">
          ${balance !== null ? balance.toFixed(2) : '0.00'}
        </p>
      </div>
    </div>
  );
}
