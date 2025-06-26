'use client';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation';

// ▼▼▼ 追加: 履歴データの型を定義 ▼▼▼

// 購入された商品の詳細
type TransactionDetailItem = {
    quantity: number;
    item: { // itemはnullになる可能性がある
        name: string | null;
        price: number | null;
    } | null;
}

// 一回の取引（購入履歴）全体の型
type TransactionHistory = {
    id: string;
    amount: number | null;
    created_at: string;
    details: TransactionDetailItem[];
}

export default function CustomerQRCodePage() {
    const supabase = createClient()
    const [userId, setUserId] = useState<string | null>(null);
    const [called, setCalled] = useState(false);
    const router = useRouter();

    // ▼▼▼ 修正: any[] を定義した型 TransactionHistory[] に変更 ▼▼▼
    const [history, setHistory] = useState<TransactionHistory[]>([]);

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser()
            const user = data?.user

            if (error || !user) {
                alert('ログインが必要です')
                router.push('/auth/login')
                return
            }

            setUserId(user.id)
        }

        fetchUser()
    }, [router]) // routerを依存配列に追加

    // 購入履歴の取得
    useEffect(() => {
        if (!userId) return;
        const fetchHistory = async () => {
            // Supabaseのselectに型を適用すると、dataの型推論がより正確になります
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
            if (!error && data) {
                
                                const transformedData = data.map(transaction => ({
                    ...transaction,
                    details: transaction.details.map(detail => ({
                        ...detail,
                        // itemが配列で返ってくるので、最初の要素を取り出してオブジェクトに変換
                        // もしitemが空配列やnullの場合はnullを設定
                        item: (detail.item && detail.item.length > 0) ? detail.item[0] : null
                    }))
                }));

                // 加工後のデータをStateにセットします
                setHistory(transformedData);
            }
        };
        fetchHistory();
    }, [userId, supabase]); // supabaseも依存配列に含めるとより厳密

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
                    // is_calledのような具体的なプロパティを持つ型として扱う
                    const newPayload = payload.new as { transaction_id: string; is_called: boolean };
                    const oldPayload = payload.old as { transaction_id: string };

                    // 削除時
                    if (payload.eventType === 'DELETE' && oldPayload) {
                        const { data } = await supabase
                            .from('transaction')
                            .select('user_id')
                            .eq('id', oldPayload.transaction_id)
                            .single();
                        if (data && data.user_id === userId) {
                            setCalled(false);
                        }
                    }
                    // 呼び出し時
                    if (payload.eventType === 'UPDATE' && newPayload && newPayload.is_called) {
                        const { data } = await supabase
                            .from('transaction')
                            .select('user_id')
                            .eq('id', newPayload.transaction_id)
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
    }, [userId, supabase]);

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
                                            {/* ▼▼▼ 修正: detailの型がTransactionDetailItemになる ▼▼▼ */}
                                            {txn.details.map((detail, i) => (
                                                <li key={i}>
                                                    {/* itemがnullでないことを確認してから表示 */}
                                                    {detail.item
                                                        ? `${detail.item.name} × ${detail.quantity}（¥${(detail.item.price ?? 0) * (detail.quantity ?? 0)}）`
                                                        : '商品情報なし'
                                                    }
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="font-semibold mt-1">合計: ¥{txn.amount ?? 0}</div>
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
