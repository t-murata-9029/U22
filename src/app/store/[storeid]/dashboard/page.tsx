'use client'

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';



// ページコンポーネントは async 関数にしない
export default function DashboardPage() { // initialParams を削除
  // useParams() を使用してクライアントサイドで params を取得
  const routerParams = useParams();
  const storeid = (routerParams.storeid as string) || '';

  const [storeName, setStoreName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!storeid) {
      setError('ストアIDが指定されていません。');
      setIsLoading(false);
      return;
    }

    const fetchStore = async () => {
      setIsLoading(true);
      const { data: store, error: fetchError } = await supabase
        .from('store')
        .select('name')
        .eq('id', storeid)
        .single();

      if (fetchError || !store) {
        console.error('Store fetch error:', fetchError);
        setError('ストア情報の取得に失敗しました。指定されたストアが存在しない可能性があります。');
        setStoreName(null);
      } else {
        setStoreName(store.name);
        setError(null);
      }
      setIsLoading(false);
    };

    fetchStore();
  }, [storeid]);

  if (isLoading) {
    return (
      <main className="p-6 max-w-md mx-auto">
        <p className="text-center">ロード中...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">エラー</h1>
        <p className="text-center text-red-500">
          {error}
        </p>
        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-500 hover:underline">ホームに戻る</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">{storeName}</h1>
      <p className="text-sm text-center text-gray-500 mb-6">ダッシュボード</p>

      <ul className="space-y-3">
        <li>
          <Link
            href={`/store/${storeid}/items`}
            className="block w-full bg-blue-600 text-white text-center px-4 py-3 rounded-lg hover:bg-blue-700 shadow-md transition-transform transform hover:scale-105"
          >
            商品管理
          </Link>
        </li>
        <li>
          <Link
            href={`/store/${storeid}/sales`}
            className="block w-full bg-green-600 text-white text-center px-4 py-3 rounded-lg hover:bg-green-700 shadow-md transition-transform transform hover:scale-105"
          >
            売上履歴
          </Link>
        </li>
        <li>
          <Link
            href={`/store/${storeid}/summary`}
            className="block w-full bg-yellow-500 text-white text-center px-4 py-3 rounded-lg hover:bg-yellow-600 shadow-md transition-transform transform hover:scale-105"
          >
            売上集計
          </Link>
        </li>
        <li>
          <Link
            href={`/store/${storeid}/waiting`}
            className="block w-full bg-purple-600 text-white text-center px-4 py-3 rounded-lg hover:bg-purple-700 shadow-md transition-transform transform hover:scale-105"
          >
            お客様待ち管理
          </Link>
        </li>
      </ul>
    </main>
  );
}