"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { supabase } from './supabase'
import { Session, User as SupabaseUser } from '@supabase/supabase-js'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface User {
  id: string
  fullName: string
  email: string
  role: string
  department: string
  isApproved: boolean
  rollNumber: string
  semester: string
}

interface RegisterResult {
  needsEmailConfirmation: boolean
}

interface DemoCredentials {
  role: string
  fullName: string
  email: string
  department: string
  rollNumber?: string
  semester?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (data: any) => Promise<RegisterResult>
  demoLogin: (creds: DemoCredentials) => void
  logout: () => void
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

function mapSupabaseUser(supabaseUser: SupabaseUser, profile: any): User {
  return {
    id: profile?.id || supabaseUser.id,
    fullName: profile?.fullName || supabaseUser.user_metadata?.full_name || '',
    email: supabaseUser.email || '',
    role: profile?.role || 'student',
    department: profile?.department || '',
    isApproved: profile?.isApproved ?? true,
    rollNumber: profile?.rollNumber || '',
    semester: profile?.semester || '',
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('auth')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser(parsed.user)
        setToken(parsed.token)
        if (parsed.token === 'demo-token') {
          setLoading(false)
          return
        }
      } catch { /* ignore */ }
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setToken(s?.access_token || null)
      if (s?.user) {
        fetchProfile(s.user, s.access_token)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setToken(s?.access_token || null)
      if (s?.user) {
        fetchProfile(s.user, s.access_token)
      } else {
        setUser(null)
        setToken(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(supabaseUser: SupabaseUser, accessToken: string) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me?accessToken=${accessToken}`)
      if (res.ok) {
        const data = await res.json()
        setUser(mapSupabaseUser(supabaseUser, data.user))
      } else {
        setUser(mapSupabaseUser(supabaseUser, null))
      }
    } catch {
      setUser(mapSupabaseUser(supabaseUser, null))
    }
    setLoading(false)
  }

  const persist = (t: string, u: User) => {
    setToken(t)
    setUser(u)
    localStorage.setItem('auth', JSON.stringify({ token: t, user: u }))
  }

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)

    const accessToken = data.session.access_token
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Login failed' }))
      throw new Error(err.detail || 'Login failed')
    }
    const result = await res.json()
    const mapped = mapSupabaseUser(data.user, result.user)
    persist(accessToken, mapped)
    return mapped
  }, [])

  const register = useCallback(async (data: any) => {
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })
    if (error) throw new Error(error.message)
    if (!signUpData.user) throw new Error('Registration failed')

    const accessToken = signUpData.session?.access_token || ''
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        authUid: signUpData.user.id,
        accessToken,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        department: data.department || '',
        rollNumber: data.rollNumber || '',
        semester: data.semester || '',
        subject: data.subject || '',
        designation: data.designation || '',
        assignedBatch: data.assignedBatch || '',
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Registration failed' }))
      throw new Error(err.detail || 'Registration failed')
    }
    const result = await res.json()
    const mapped = mapSupabaseUser(signUpData.user, result.user)

    if (accessToken) {
      persist(accessToken, mapped)
      return { needsEmailConfirmation: false }
    }

    return { needsEmailConfirmation: true }
  }, [])

  const demoLogin = useCallback((creds: DemoCredentials) => {
    const demoUser: User = {
      id: `demo-${creds.role}-${Date.now()}`,
      fullName: creds.fullName,
      email: creds.email,
      role: creds.role,
      department: creds.department,
      isApproved: true,
      rollNumber: creds.rollNumber || `DEMO-${creds.role.toUpperCase()}`,
      semester: creds.semester || '3',
    }
    persist('demo-token', demoUser)
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setToken(null)
    setSession(null)
    localStorage.removeItem('auth')
  }, [])

  const refresh = useCallback(async () => {
    const { data: { session: s } } = await supabase.auth.getSession()
    if (!s) {
      logout()
      return
    }
    setToken(s.access_token)
    try {
      const res = await fetch(`${API_BASE}/api/auth/me?accessToken=${s.access_token}`)
      if (res.ok) {
        const data = await res.json()
        setUser(mapSupabaseUser(s.user, data.user))
      }
    } catch {
      logout()
    }
  }, [logout])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, demoLogin, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
