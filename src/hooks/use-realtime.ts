"use client"

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

type TableName = 'User' | 'Attendance' | 'LeaveRequest' | 'Survey'

interface UseRealtimeOptions {
  table: TableName
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  filter?: string
  schema?: string
}

interface RealtimeState<T> {
  data: T[]
  loading: boolean
  error: string | null
}

export function useRealtime<T = any>({ table, event = '*', filter, schema = 'public' }: UseRealtimeOptions) {
  const [state, setState] = useState<RealtimeState<T>>({ data: [], loading: true, error: null })

  useEffect(() => {
    let cancelled = false

    const channel = supabase
      .channel(`${table}-realtime`)
      .on(
        'postgres_changes',
        { event, schema, table, filter },
        (payload: RealtimePostgresChangesPayload<T>) => {
          if (cancelled) return

          setState(prev => {
            let newData = [...prev.data]

            if (payload.eventType === 'INSERT') {
              newData.push(payload.new as T)
            } else if (payload.eventType === 'UPDATE') {
              const idx = newData.findIndex((item: any) => item.id === (payload.new as any).id)
              if (idx >= 0) {
                newData[idx] = payload.new as T
              } else {
                newData.push(payload.new as T)
              }
            } else if (payload.eventType === 'DELETE') {
              newData = newData.filter((item: any) => item.id !== (payload.old as any).id)
            }

            return { ...prev, data: newData }
          })
        }
      )
      .subscribe((status) => {
        if (cancelled) return
        if (status === 'SUBSCRIBED') {
          setState(prev => ({ ...prev, loading: false }))
        } else if (status === 'CHANNEL_ERROR') {
          setState(prev => ({ ...prev, loading: false, error: 'Realtime subscription failed' }))
        }
      })

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [table, event, filter, schema])

  const setData = useCallback((data: T[]) => {
    setState(prev => ({ ...prev, data }))
  }, [])

  return { ...state, setData }
}
