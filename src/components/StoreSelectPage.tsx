// StoreSelectPage.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// Supabaseクライアントのインポートパスはご自身の環境に合わせてください
import { supabase } from '@/lib/supabase';

// このコンポーネントが受け取るpropsの型定義
interface StoreSelectPageProps {
  eventId: string;
}

export default function StoreSelectPage({ eventId }: StoreSelectPageProps) {
  const [stores, setStores] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // eventIdが渡されていない場合は何もしない
    if (!eventId) {
      setLoading(false);
      return;
    }

    const fetchStores = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('store')
        .select('id, name')
        .eq('event_id', eventId);

      if (error) {
        console.error('ストア取得エラー:', error.message);
      } else {
        setStores(data || []);
      }
      setLoading(false);
    };

    fetchStores();
  }, [eventId]);

  const handleSelect = (storeId: string) => {
    // ★★★ 修正箇所 ★★★
    // 選択されたストアのIDを使って、ダッシュボードページのURLへ遷移します
    // 例: /store/ストアのID/dashboard
    router.push(`/store/${storeId}/dashboard`);
  };

  // ローディング中の表示
  if (loading) {
    return (
      <main className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">ストア選択</h1>
        <p className="text-center text-gray-500">ストア情報を読み込み中...</p>
      </main>
    );
  }

  // ストアが存在しない場合の表示
  if (stores.length === 0) {
    return (
      <main className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">ストア選択</h1>
        <p className="text-center text-gray-500">このイベントに登録されているストアはありません。</p>
      </main>
    );
  }

  // ストアリストとボタンの表示
  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">ストア選択</h1>
      <ul className="space-y-3">
        {stores.map((store) => (
          <li key={store.id}>
            <button
              onClick={() => handleSelect(store.id)}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 shadow-md transition-transform transform hover:scale-105"
            >
              {store.name}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}