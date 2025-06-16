// app/eventupload/EventUploadClient.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Props = {
  userId: string
  email: string
}

export default function EventUploadClient({ userId,email }: Props) {
  const [eventName, setEventName] = useState('')
  const [creating, setCreating] = useState(false)

  const router = useRouter()

  const handleCreateEvent = async () => {
    if (!eventName) {
      alert('イベント名を入力してください')
      return
    }

    setCreating(true)

    const { data, error } = await supabase
      .from('event')
      .insert([
        {
          owner_id: userId,
          email:email,
          name: eventName,
        },
      ])
      .select()
      .single()

    setCreating(false)

    if (error || !data) {
      console.error('イベント作成エラー:', error?.message)
      alert('イベント作成に失敗しました')
      return
    }

    router.push(`/dashboardTest/${data.id}`)
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="イベント名"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      

      <button
        onClick={handleCreateEvent}
        disabled={creating}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {creating ? '作成中...' : 'イベント作成'}
      </button>
    </div>
  )
}
