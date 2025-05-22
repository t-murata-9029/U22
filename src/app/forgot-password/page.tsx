'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('パスワードリセット用のメールを送信しました。');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: 'auto' }}>
      <h1>パスワードリセット</h1>
      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="登録したメールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', width: '100%', padding: 8, marginBottom: 10 }}
        />
        <button type="submit" style={{ padding: 10 }}>リセットメールを送信</button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
