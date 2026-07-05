
'use client';

import { useEffect, useState } from 'react';
import { Query, onSnapshot, DocumentData } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';
import { useDemo } from '../demo-context';

export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const { isDemo } = useDemo();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    if (isDemo) {
      setData([] as T[]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query,
      (snapshot: any) => {
        const docs = snapshot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }));
        setData(docs as T[]);
        setLoading(false);
      },
      (err: any) => {
        const permissionError = new FirestorePermissionError({
          path: (query as any)._path?.relativeName || 'unknown',
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query, isDemo]);

  return { data, loading, error };
}
