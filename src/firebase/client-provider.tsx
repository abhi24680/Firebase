
'use client';

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

export const FirebaseClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [instances, setInstances] = useState<ReturnType<typeof initializeFirebase> | null>(null);

  useEffect(() => {
    try {
      const initialized = initializeFirebase();
      setInstances(initialized);
    } catch {
      // Firebase config may be demo/placeholder; allow rendering without crash
      setInstances(null);
    }
  }, []);

  if (!instances) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            Initializing Infrastructure...
          </p>
        </div>
      </div>
    )
  }

  return (
    <FirebaseProvider
      app={instances.app}
      firestore={instances.firestore}
      auth={instances.auth}
    >
      {children}
    </FirebaseProvider>
  );
};
