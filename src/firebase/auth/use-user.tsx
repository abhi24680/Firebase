
'use client';

import { useEffect, useState, useMemo } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';
import { useDemo } from '../demo-context';

export function useUser() {
  const auth = useAuth();
  const { isDemo, demoProfile } = useDemo();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemo) {
      setLoading(false);
      return;
    }
    if (!auth) return;
    return onAuthStateChanged(auth, (user: User | null) => {
      setUser(user);
      setLoading(false);
    });
  }, [auth, isDemo]);

  const demoUser = useMemo<User | null>(() => {
    if (!isDemo || !demoProfile) return null;
    return {
      uid: demoProfile.uid,
      email: demoProfile.email,
      displayName: demoProfile.fullName,
      emailVerified: true,
      isAnonymous: false,
      phoneNumber: null,
      photoURL: null,
      providerId: 'demo',
      metadata: {} as any,
      providerData: [],
      refreshToken: '',
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => 'demo-token',
      getIdTokenResult: async () => ({ token: 'demo-token', signInProvider: 'demo', claims: {}, authTime: '', issuedAtTime: '', expirationTime: '' }),
      reload: async () => {},
      toJSON: () => ({}),
    };
  }, [isDemo, demoProfile]);

  return { user: isDemo ? demoUser : user, loading };
}
