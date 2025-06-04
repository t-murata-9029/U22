'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Summary = {
    item_id: string;
    name: string;
    total_quantity: number;
    total_amount: number;
};

export default function SummaryPage() {
    const [summary, setSummary] = useState<Summary[]>([]);
    const [storeId, setStoreId] = useState<string | null>(null);

    useEffect(() => {
        const id = localStorage.getItem('store_id');
        if (!id) return;
        setStoreId(id);

        const fetchSummary = async () => {
            const { data, error } = await supabase.rpc('get_sales_summary_by_item', {
                target_store_id: id,
            });
            if (error) {
                console.error(error);
                return;
            }
            setSummary(data || []);
        };

        fetchSummary();
    }, []);

    return (
        <main>
            <h1>売上集計</h1>
            <table>
                <thead>
                    <tr>
                        <th>商品名</th>
                        <th>販売数</th>
                        <th>売上合計</th>
                    </tr>
                </thead>
                <tbody>
                    {summary.map((s) => (
                        <tr key={s.item_id}>
                            <td>{s.name}</td>
                            <td>{s.total_quantity}</td>
                            <td>¥{s.total_amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}
