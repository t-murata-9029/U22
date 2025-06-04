'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Html5Qrcode } from "html5-qrcode";


export default function WaitingPage() {
    const [storeId, setStoreId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [inputUserId, setInputUserId] = useState('');
    const [items, setItems] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
    const [callQueues, setCallQueues] = useState<any[]>([]);

    // QRコード読み取り用
    const [scanning, setScanning] = useState(false);

    // store_id を localStorage から取得（初回のみ）
    useEffect(() => {
        const id = localStorage.getItem('store_id');
        setStoreId(id);
    }, []);

    // 商品一覧の取得
    useEffect(() => {
        if (!storeId) return;
        supabase
            .from('item')
            .select('id, name, price')
            .eq('store_id', storeId)
            .then(({ data }) => setItems(data || []));

        fetchCallQueues(storeId);
    }, [storeId]);

    // 呼び出し待ち一覧の取得
    const fetchCallQueues = async (storeId: string) => {
        const { data, error } = await supabase
            .from('call_queue')
            .select(`
        id,
        is_called,
        transaction:transaction_id (
          id,
          user_id,
          amount,
          store_id,
          details:transaction_detail (
            quantity,
            item:item_id (
              name,
              price
            )
          )
        )
      `)
            .order('id', { ascending: true });

        // transaction.store_id でフィルタ
        const filtered = (data || []).filter(
            (queue: any) => queue.transaction && queue.transaction.store_id === storeId
        );

        if (error) {
            console.error('呼び出し一覧取得エラー', error);
            return;
        }

        setCallQueues(filtered);
    };

    // 購入登録処理
    const handlePurchase = async () => {
        if (!storeId || !userId) return;

        const total = items.reduce((sum, item) => {
            return sum + (selectedItems[item.id] || 0) * item.price;
        }, 0);

        const { data: transaction, error: transError } = await supabase
            .from('transaction')
            .insert([{ store_id: storeId, user_id: userId, amount: total }])
            .select()
            .single();

        if (transError || !transaction) {
            alert('購入登録に失敗しました');
            return;
        }

        const details = Object.entries(selectedItems)
            .filter(([, qty]) => qty > 0)
            .map(([itemId, qty]) => ({
                transaction_id: transaction.id,
                item_id: itemId,
                quantity: qty,
            }));

        const { error: detailError } = await supabase
            .from('transaction_detail')
            .insert(details);

        if (detailError) {
            alert('商品詳細登録に失敗しました');
            return;
        }

        const { error: queueError } = await supabase
            .from('call_queue')
            .insert([{ transaction_id: transaction.id, is_called: false }]);

        if (queueError) {
            alert('呼び出しキュー登録に失敗しました');
            return;
        }

        alert('登録が完了しました！');
        setUserId(null);
        setInputUserId('');
        setSelectedItems({});
        fetchCallQueues(storeId);
    };

    const startScan = () => {
        setScanning(true);
        const html5QrCode = new Html5Qrcode("qr-reader");
        html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText) => {
                setInputUserId(decodedText);
                setUserId(decodedText);
                html5QrCode.stop();
                setScanning(false);
            },
            (errorMessage) => {
                // 読み取りエラー時の処理（無視してOK）
            }
        );
    };

    return (
        <main className="p-4">
            <h1 className="text-xl font-bold mb-4">お客様待ち管理</h1>

            {!storeId && <p className="text-red-500">store_id が取得できません。再読み込みしてください。</p>}

            {storeId && !userId && (
                <div className="mb-6">
                    <label className="block mb-2 font-semibold">お客様のQRコードをカメラで読み取ってください：</label>
                    <div className="max-w-xs">
                        <div id="qr-reader" />
                        <button
                            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                            onClick={startScan}
                            disabled={scanning}
                        >
                            {scanning ? "スキャン中..." : "QRコードを読み取る"}
                        </button>
                    </div>
                    <p className="mt-2 text-gray-600">QRコードをカメラにかざしてください。</p>
                </div>
            )}

            {storeId && userId && (
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mt-4">商品を選択</h2>
                    <ul className="mb-4">
                        {items.map((item) => (
                            <li key={item.id} className="mb-1">
                                {item.name} (¥{item.price})
                                <input
                                    type="number"
                                    min={0}
                                    value={selectedItems[item.id] || 0}
                                    onChange={(e) =>
                                        setSelectedItems({
                                            ...selectedItems,
                                            [item.id]: parseInt(e.target.value),
                                        })
                                    }
                                    className="ml-2 w-16 border px-2"
                                />
                            </li>
                        ))}
                    </ul>
                    <button onClick={handlePurchase} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
                        購入登録
                    </button>
                    <button onClick={() => setUserId(null)} className="bg-gray-400 text-white px-4 py-2 rounded">
                        キャンセル
                    </button>
                </div>
            )}

            <div>
                <h2 className="text-lg font-semibold mb-2">呼び出し待ち一覧</h2>
                <div className="flex gap-8">
                    {/* 呼び出し待ち一覧 */}
                    <div className="flex-1">
                        <h3 className="font-semibold mb-2">待ち</h3>
                        {callQueues.length === 0 ? (
                            <p>現在、呼び出し待ちはありません。</p>
                        ) : (
                            <ul className="space-y-4">
                                {callQueues
                                    .filter((queue) => !queue.is_called)
                                    .map((queue) => (
                                        <li key={queue.id} className="border p-3 rounded bg-gray-100">
                                            <p className="font-bold">ユーザーID: {queue.transaction.user_id}</p>
                                            <ul className="ml-4 list-disc">
                                                {queue.transaction.details.map((detail: any, i: number) => (
                                                    <li key={i}>
                                                        {detail.item.name} × {detail.quantity}（¥{detail.item.price * detail.quantity}）
                                                    </li>
                                                ))}
                                            </ul>
                                            <p className="mt-1 font-semibold">合計金額: ¥{queue.transaction.amount}</p>
                                            <div className="mt-2 flex gap-2">
                                                <button
                                                    className="bg-green-600 text-white px-3 py-1 rounded"
                                                    onClick={async () => {
                                                        await supabase
                                                            .from('call_queue')
                                                            .update({ is_called: true })
                                                            .eq('id', queue.id);
                                                        fetchCallQueues(storeId!);
                                                    }}
                                                >
                                                    呼び出し
                                                </button>
                                                <button
                                                    className="bg-red-600 text-white px-3 py-1 rounded"
                                                    onClick={async () => {
                                                        await supabase
                                                            .from('call_queue')
                                                            .delete()
                                                            .eq('id', queue.id);
                                                        fetchCallQueues(storeId!);
                                                    }}
                                                >
                                                    削除
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </div>
                    {/* 呼び出し中一覧 */}
                    <div className="flex-1">
                        <h3 className="font-semibold mb-2">呼び出し中</h3>
                        {callQueues.filter((queue) => queue.is_called).length === 0 ? (
                            <p>現在、呼び出し中はありません。</p>
                        ) : (
                            <ul className="space-y-4">
                                {callQueues
                                    .filter((queue) => queue.is_called)
                                    .map((queue) => (
                                        <li key={queue.id} className="border p-3 rounded bg-yellow-100">
                                            <p className="font-bold">ユーザーID: {queue.transaction.user_id}</p>
                                            <ul className="ml-4 list-disc">
                                                {queue.transaction.details.map((detail: any, i: number) => (
                                                    <li key={i}>
                                                        {detail.item.name} × {detail.quantity}（¥{detail.item.price * detail.quantity}）
                                                    </li>
                                                ))}
                                            </ul>
                                            <p className="mt-1 font-semibold">合計金額: ¥{queue.transaction.amount}</p>
                                            <div className="mt-2 flex gap-2">
                                                <button
                                                    className="bg-red-600 text-white px-3 py-1 rounded"
                                                    onClick={async () => {
                                                        await supabase
                                                            .from('call_queue')
                                                            .delete()
                                                            .eq('id', queue.id);
                                                        fetchCallQueues(storeId!);
                                                    }}
                                                >
                                                    削除
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
