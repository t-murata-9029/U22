'use client';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation';


export default function CustomerQRCodePage() {
    const supabase = createClient()
    const [userId, setUserId] = useState<string | null>(null);
    const [called, setCalled] = useState(false);
    const router = useRouter();
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser()
            const user = data?.user

            if (error || !user) {
                alert('ログインが必要です')
                // ログイン画面にリダイレクトする場合は下記も可
                router.push('/auth/login')
                return
            }

            setUserId(user.id)
        }

        fetchUser()
    }, [])

    // 購入履歴の取得
    useEffect(() => {
        if (!userId) return;
        const fetchHistory = async () => {
            const { data, error } = await supabase
                .from('transaction')
                .select(`
                    id,
                    amount,
                    created_at,
                    details:transaction_detail (
                        quantity,
                        item:item_id (
                            name,
                            price
                        )
                    )
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            console.log('履歴取得', { data, error });
            if (!error && data) setHistory(data);
        };
        fetchHistory();
    }, [userId]);

    // リアルタイム通知
    useEffect(() => {
        if (!userId) return;

        const channel = supabase
            .channel('call_queue_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'call_queue',
                },
                async (payload) => {
                    // 削除時
                    if (payload.eventType === 'DELETE' && payload.old) {
                        const { data } = await supabase
                            .from('transaction')
                            .select('user_id')
                            .eq('id', payload.old.transaction_id)
                            .single();
                        if (data && data.user_id === userId) {
                            setCalled(false);
                        }
                    }
                    // 呼び出し時
                    if (payload.eventType === 'UPDATE' && payload.new && payload.new.is_called) {
                        const { data } = await supabase
                            .from('transaction')
                            .select('user_id')
                            .eq('id', payload.new.transaction_id)
                            .single();
                        if (data && data.user_id === userId) {
                            setCalled(true);
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    return (
        <main className="p-4">
            <h1 className="text-xl font-bold mb-4">あなたのQRコード</h1>
            {userId ? (
                <>
                    <div className="bg-white p-4 inline-block shadow">
                        <QRCode value={userId} size={256} />
                    </div>
                    <p className="mt-4">このQRコードを店舗に提示してください。</p>
                    {called && (
                        <div className="mt-4 p-4 bg-green-200 text-green-800 rounded">
                            店舗から呼び出しがありました！
                        </div>
                    )}

                    <div className="mt-8">
                        <h2 className="text-lg font-semibold mb-2">購入履歴</h2>
                        {history.length === 0 ? (
                            <p>購入履歴はありません。</p>
                        ) : (
                            <ul className="space-y-4">
                                {history.map((txn) => (
                                    <li key={txn.id} className="border p-3 rounded bg-gray-50">
                                        <div className="text-sm text-gray-500">
                                            {new Date(txn.created_at).toLocaleString()}
                                        </div>
                                        <ul className="ml-4 list-disc">
                                            {txn.details.map((detail: any, i: number) => (
                                                <li key={i}>
                                                    {detail.item.name} × {detail.quantity}（¥{detail.item.price * detail.quantity}）
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="font-semibold mt-1">合計: ¥{txn.amount}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            ) : (
                <p>ユーザーIDが見つかりません。ページを再読み込みしてください。</p>
            )}
        </main>
    );
}
