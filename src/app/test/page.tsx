'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        // 未ログインの場合はログインページへ
        router.push('/login');
        return;
      }

      setUserId(user.id);
      setLoading(false);
    };

    getUser();
  }, [router, supabase]);

  if (loading) {
    return <p>読み込み中...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>ログイン中のユーザー</h1>
      <p><strong>ユーザーID:</strong> {userId}</p>
    </div>
  );
}
