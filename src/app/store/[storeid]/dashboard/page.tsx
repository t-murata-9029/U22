// app/store/[storeid]/dashboard/page.tsx
'use client'; // 👈 1. クライアントコンポーネントとして宣言

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type StorePageParams = {
  storeid: string;
};

type StoreData = {
  name: string;
};

export default function DashboardPage() {
  const { storeid } = useParams<StorePageParams>();
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // データを取得する非同期関数
    const fetchStoreData = async () => {
      try {
        const response = await fetch(`/api/store/${storeid}`); // APIルートから取得
        if (!response.ok) {
          throw new Error('ストア情報の取得に失敗しました。');
        }
        const data: StoreData = await response.json();
        setStore(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeid]); // storeidが変わった時だけ再実行

  // ローディング中の表示
  if (loading) {
    return <main className="p-6 text-center">読み込み中...</main>;
  }

  // エラー時の表示
  if (error) {
    return (
      <main className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">エラー</h1>
        <p className="text-center text-red-500">{error}</p>
        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-500 hover:underline">ホームに戻る</Link>
        </div>
      </main>
    );
  }

  // 正常時の表示
  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">{store?.name}</h1>
      <p className="text-sm text-center text-gray-500 mb-6">ダッシュボード</p>
      
      {/* リンク部分は元のコードと同じ */}
      <ul className="space-y-3">
        <li>
          <Link href={`/store/${storeid}/items`} className="block w-full bg-blue-600 text-white text-center px-4 py-3 rounded-lg hover:bg-blue-700 shadow-md transition-transform transform hover:scale-105">
            商品管理
          </Link>
        </li>
        <li>
          <Link href={`/store/${storeid}/sales`} className="block w-full bg-green-600 text-white text-center px-4 py-3 rounded-lg hover:bg-green-700 shadow-md transition-transform transform hover:scale-105">
            売上履歴
          </Link>
        </li>
        <li>
          <Link href={`/store/${storeid}/summary`} className="block w-full bg-yellow-500 text-white text-center px-4 py-3 rounded-lg hover:bg-yellow-600 shadow-md transition-transform transform hover:scale-105">
            売上集計
          </Link>
        </li>
        <li>
          <Link href={`/store/${storeid}/waiting`} className="block w-full bg-purple-600 text-white text-center px-4 py-3 rounded-lg hover:bg-purple-700 shadow-md transition-transform transform hover:scale-105">
            お客様待ち管理
          </Link>
        </li>
      </ul>
    </main>
  );
}