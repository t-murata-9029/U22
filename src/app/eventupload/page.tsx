'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function CreateEventPage() {
  const supabase = createClient();
  const router = useRouter();

  const [eventName, setEventName] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getSession();
    const user = data?.session?.user;

    if (!user || error) {
      router.push('/login');
      return;
    }

    setUserId(user.id);
    setEmail(user.email ?? null);
  };

  fetchUser();
}, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!userId) {
      setError('ユーザーが未認証です');
      return;
    }

    if (!email) {
      setError('メールアドレスが取得できませんでした');
      return;
    }

    if (eventName.trim() === '') {
      setError('イベント名を入力してください');
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from('event').insert({
      name: eventName,
      owner_id: userId,
      email: email,
    });

    setIsLoading(false);

    if (error) {
      setError(`エラー: ${error.message}`);
    } else {
      setMessage('イベントを作成しました！');
      setEventName('');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: 'auto' }}>
      <h1>イベント作成</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="イベント名"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <button type="submit" style={{ padding: 10 }} disabled={isLoading}>
          {isLoading ? '作成中...' : '作成する'}
        </button>
      </form>
      {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
    </div>
  );
}
