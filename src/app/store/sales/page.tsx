'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Sale = {
    id: string;
    amount: number;
    datetime: string;
};

export default function SalesPage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [storeId, setStoreId] = useState<string | null>(null);

    useEffect(() => {
        const id = localStorage.getItem('store_id');
        if (!id) return;
        setStoreId(id);

        const fetchSales = async () => {
            const { data } = await supabase
                .from('transaction')
                .select('id, amount, datetime')
                .eq('store_id', id)
                .order('datetime', { ascending: false });
            setSales(data || []);
        };

        fetchSales();
    }, []);

    return (
        <main>
            <h1>売上履歴</h1>
            <ul>
                {sales.map((sale) => (
                    <li key={sale.id}>
                        {new Date(sale.datetime).toLocaleString()} - ¥{sale.amount}
                    </li>
                ))}
            </ul>
        </main>
    );
}
