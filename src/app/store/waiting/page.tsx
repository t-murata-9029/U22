'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Html5Qrcode } from "html5-qrcode";
import { ItemData } from '@/interfases/item';
import { CallQueueData } from '@/interfases/callQueue';

export default function WaitingPage() {
    const [storeId, setStoreId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [inputUserId, setInputUserId] = useState('');
    const [items, setItems] = useState<ItemData[]>([]);
    const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
    const [callQueues, setCallQueues] = useState<CallQueueData[]>([]);

    // QRコード読み取り用
    const [scanning, setScanning] = useState(false);



    // 商品一覧の取得
    useEffect(() => {
        // カスみたいなコード将来消すべき
        setStoreId("");
        console.log(inputUserId);
        if (!storeId) return;
        supabase
            .from('item')
            .select('id, name, price, store_id, image, description')
            .eq('store_id', storeId)
            .then(({ data, error }) => {
                if (error) {
                    console.error('商品一覧の取得エラー', error);
                } else {
                    setItems(data || []);
                }
            });

        fetchCallQueues(storeId);
    }, []);

    const fetchCallQueues = async (storeId: string) => {
        // 関連テーブルのカラムで直接フィルタリングする
        // `transaction_id` は call_queue テーブルの外部キーカラム名と仮定
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
            // .eq() を使って、データベース側で絞り込みを行う
            // 書式: '外部キーカラム名.関連テーブルのカラム名'
            .eq('transaction_id.store_id', storeId)
            .order('id', { ascending: true });

        if (error) {
            console.error('呼び出し一覧取得エラー', error);
            return;
        }

        // 既にDBでフィルタ済みなので、JSでのfilter処理は不要になる
        setCallQueues(data || []);
    };



    // 購入登録処理
    const handlePurchase = async () => {
        if (!storeId || !userId) return;

        const total = items.reduce((sum, item) => {
            return sum + (selectedItems[item.id] || 0) * (item.price ?? 0);
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
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
                setInputUserId(decodedText);
                setUserId(decodedText);
                html5QrCode.stop().catch(err => console.error("QR Code stop error", err));
                setScanning(false);
            },
            () => {
                // 読み取りエラー時の処理（通常は無視）
            }
        ).catch(err => {
            console.error("QR Code start error", err);
            setScanning(false);
        });
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
                            <li key={item.id} className="mb-1 flex items-center justify-between">
                                <span>{item.name} (¥{item.price})</span>
                                <input
                                    type="number"
                                    min={0}
                                    value={selectedItems[item.id] || 0}
                                    onChange={(e) =>
                                        setSelectedItems({
                                            ...selectedItems,
                                            [item.id]: parseInt(e.target.value) || 0,
                                        })
                                    }
                                    className="ml-2 w-20 border px-2 text-right"
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
                <div className="flex flex-col md:flex-row gap-8">
                    {/* 呼び出し待ち一覧 */}
                    <div className="flex-1">
                        <h3 className="font-semibold mb-2">待ち</h3>
                        {callQueues.filter((queue) => !queue.is_called).length === 0 ? (
                            <p>現在、呼び出し待ちはありません。</p>
                        ) : (
                            <ul className="space-y-4">
                                {callQueues
                                    .filter((queue) => !queue.is_called)
                                    .map((queue) => (
                                        // queue.transactionが存在し、空でないことを確認
                                        queue.transaction && queue.transaction.length > 0 && (
                                            <li key={queue.id} className="border p-3 rounded bg-gray-100">
                                                {/* transactionは配列なので、最初の要素[0]にアクセス */}
                                                <p className="font-bold">ユーザーID: {queue.transaction[0].user_id}</p>
                                                <ul className="ml-4 list-disc">
                                                    {queue.transaction[0].details.map((detail, i) => (
                                                        // detail.itemも存在し、空でないことを確認
                                                        detail.item && detail.item.length > 0 && (
                                                            <li key={i}>
                                                                {/* itemも配列なので、最初の要素[0]にアクセス */}
                                                                {detail.item[0].name} × {detail.quantity}（¥{detail.item[0].price * detail.quantity}）
                                                            </li>
                                                        )
                                                    ))}
                                                </ul>
                                                <p className="mt-1 font-semibold">合計金額: ¥{queue.transaction[0].amount}</p>
                                                {/* ... ボタン部分は変更なし ... */}
                                            </li>
                                        )
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
                                        // こちらも同様に存在チェック
                                        queue.transaction && queue.transaction.length > 0 && (
                                            <li key={queue.id} className="border p-3 rounded bg-yellow-100">
                                                <p className="font-bold">ユーザーID: {queue.transaction[0].user_id}</p>
                                                <ul className="ml-4 list-disc">
                                                    {queue.transaction[0].details.map((detail, i) => (
                                                        detail.item && detail.item.length > 0 && (
                                                            <li key={i}>
                                                                {detail.item[0].name} × {detail.quantity}（¥{detail.item[0].price * detail.quantity}）
                                                            </li>
                                                        )
                                                    ))}
                                                </ul>
                                                <p className="mt-1 font-semibold">合計金額: ¥{queue.transaction[0].amount}</p>
                                                {/* ... ボタン部分は変更なし ... */}
                                            </li>
                                        )
                                    ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}