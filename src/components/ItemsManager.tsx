//ItemsManager.tsx

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Itemの型定義
type Item = {
  id: string;
  name: string;
  price: number;
  description: string;
};

// コンポーネントが受け取るpropsの型定義
interface ItemsManagerProps {
  storeid: string; // ★ propsとしてstoreidを受け取る
}

export default function ItemsManager({ storeid }: ItemsManagerProps) {
  const [items, setItems] = useState<Item[]>([]);
  // ★ storeId の useState は不要になる
  // const [storeId, setStoreId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '' });

  // ★ useEffect のロジックを修正
  useEffect(() => {
    // storeidがpropsとして渡されていない場合は何もしない
    if (!storeid) return;
    
    // propsのstoreidを使って商品を取得
    fetchItems(storeid);
  }, [storeid]); // ★ 依存配列にpropsのstoreidを指定

  const fetchItems = async (id: string) => {
    const { data } = await supabase
      .from('item')
      .select('id, name, price, description')
      .eq('store_id', id);
    setItems(data || []);
  };

  // 商品追加
  const handleAddItem = async () => {
    // ★ storeIdステートの代わりに、propsのstoreidを使用
    if (!storeid || !newItem.name || !newItem.price) return;

    const { data, error } = await supabase
      .from('item')
      .insert([
        {
          store_id: storeid, // ★ propsのstoreidを使用
          name: newItem.name,
          price: Number(newItem.price),
          description: newItem.description,
        },
      ])
      .select()
      .single();

    if (error) {
      alert('商品追加に失敗しました');
      return;
    }

    setItems((prev) => [...prev, data]);
    setNewItem({ name: '', price: '', description: '' });
  };

  // 商品削除 (変更なし)
  const handleDeleteItem = async (id: string) => {
    if (!confirm('この商品を削除しますか？')) return;
    const { error } = await supabase.from('item').delete().eq('id', id);
    if (error) {
      alert('削除に失敗しました');
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // JSX部分 (変更なし)
  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">商品一覧・管理</h1>

      <ul className="mb-6">
        {items.map((item) => (
          <li key={item.id} className="mb-3 border-b pb-2">
            <div className="flex justify-between items-center">
              <div>
                <strong>{item.name}</strong> - ¥{item.price}
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="text-red-500 hover:underline"
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">商品追加</h2>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="商品名"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="border px-3 py-1 w-full"
        />
        <input
          type="number"
          placeholder="価格"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          className="border px-3 py-1 w-full"
        />
        <textarea
          placeholder="説明"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          className="border px-3 py-1 w-full"
        />
        <button
          onClick={handleAddItem}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          追加
        </button>
      </div>
    </main>
  );
}