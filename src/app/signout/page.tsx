// app/signout/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignOutPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const logout = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('ログアウト失敗:', error.message);
        alert('ログアウトに失敗しました');
      }
      router.push('/signin'); // ログアウト後ログインページへ遷移
    };

    logout();
  }, [router, supabase]);

  return <p>ログアウト中...</p>;
}
