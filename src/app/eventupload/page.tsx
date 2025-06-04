// app/eventupload/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EventUploadClient from './EventUploadClient'

export default async function EventUploadPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // 未ログインならリダイレクト
    redirect('/auth/login')
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">イベント作成</h1>
      {/* クライアントコンポーネントに props で userId を渡す */}
      <EventUploadClient userId={user.id} email={user.email!} />
    </div>
  )
}
