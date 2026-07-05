
'use client';

import { useEffect, useState } from 'react';
import { DocumentReference, onSnapshot, DocumentData } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';
import { useDemo } from '../demo-context';

export function useDoc<T = DocumentData>(ref: DocumentReference<T> | null) {
  const { isDemo, demoProfile } = useDemo();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      return;
    }

    if (isDemo && demoProfile && ref.path === `users/${demoProfile.uid}`) {
      setData({ ...demoProfile } as unknown as T);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      ref,
      (snapshot: any) => {
        setData(snapshot.exists() ? { ...snapshot.data(), id: snapshot.id } as T : null);
        setLoading(false);
      },
      (err: any) => {
        const permissionError = new FirestorePermissionError({
          path: ref.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ref, isDemo, demoProfile]);

  return { data, loading, error };
}
