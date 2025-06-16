// SalesHistory.tsx

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// 売上データの型定義
type Sale = {
  id: string;
  amount: number;
  datetime: string;
};

// コンポーネントが受け取るpropsの型定義
interface SalesHistoryProps {
  storeid: string; // ★ propsとしてstoreidを受け取る
}

export default function SalesHistory({ storeid }: SalesHistoryProps) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  // ★ storeId の useState は不要になります
  // const [storeId, setStoreId] = useState<string | null>(null);

  // ★ useEffect のロジックを修正
  useEffect(() => {
    // storeidがpropsとして渡されていない場合は何もしない
    if (!storeid) {
      setLoading(false);
      return;
    }

    const fetchSales = async () => {
      setLoading(true);
      // ★ propsのstoreidを使って売上を取得
      const { data, error } = await supabase
        .from('transaction') // 'transaction'テーブルから取得
        .select('id, amount, datetime')
        .eq('store_id', storeid)
        .order('datetime', { ascending: false }); // 日付の降順で並び替え

      if (error) {
        console.error('売上履歴の取得に失敗しました:', error);
      } else {
        setSales(data || []);
      }
      setLoading(false);
    };

    fetchSales();
  }, [storeid]); // ★ 依存配列にpropsのstoreidを指定

  // ローディング中の表示
  if (loading) {
    return (
      <main className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">売上履歴</h1>
        <p>読み込み中...</p>
      </main>
    )
  }

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">売上履歴</h1>
      
      {sales.length === 0 ? (
        <p>売上履歴はありません。</p>
      ) : (
        <ul className="space-y-2">
          {sales.map((sale) => (
            <li key={sale.id} className="border-b p-2 flex justify-between">
              <span>
                {/* 日付を日本時間で分かりやすく表示 */}
                {new Date(sale.datetime).toLocaleString('ja-JP')}
              </span>
              <span className="font-semibold">
                &yen;{sale.amount.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}