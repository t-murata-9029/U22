'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Props = {
  eventid: string
}

export default function EventDashboardClient({ eventid}: Props) {
  const [event, setEvent] = useState<any>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from('event')
        .select('*')
        .eq('id', eventid)
        .single()

      if (error) {
        console.error('イベント取得失敗:', error.message)
        return
      }

      setEvent(data)
    }

    fetchEvent()
  }, [eventid])

  if (!event) return <p>読み込み中...</p>

  // Store作成用URLを組み立て
  const storeCreateUrl = `/EventTest/${eventid}/create`
  const storeDashboardUrl = `/EventTest/${eventid}/StoresbyEvent`

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">イベントダッシュボード</h1>

      <p><strong>イベント名:</strong> {event.name}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">store作成用リンク</h2>
        <Link href={storeCreateUrl} className="text-blue-600 underline">
          {storeCreateUrl}
        </Link>

        <h2 className="text-xl font-semibold mt-6 mb-2">ストアダッシュボード</h2>
        <Link href={storeDashboardUrl} className="text-blue-600 underline">
          {storeDashboardUrl}
        </Link>
      </div>
    </div>
  )
}
