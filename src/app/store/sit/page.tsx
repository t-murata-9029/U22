'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function StoreSelectPage() {
    const [stores, setStores] = useState<{ id: string; name: string }[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchStores = async () => {
            const { data, error } = await supabase.from('store').select('id, name');
            if (error) {
                console.error('ストア取得エラー:', error.message);
                return;
            }
            setStores(data || []);
        };

        fetchStores();
    }, []);

    const handleSelect = (storeId: string) => {
        localStorage.setItem('store_id', storeId);
        router.push('/store/dashboard');
    };

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">ストア選択</h1>
            {stores.length === 0 ? (
                <p>ストア情報を読み込み中...</p>
            ) : (
                <ul className="space-y-2">
                    {stores.map((store) => (
                        <li key={store.id}>
                            <button
                                onClick={() => handleSelect(store.id)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                {store.name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
