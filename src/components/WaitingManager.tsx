// WaitingManager.tsx

'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Html5Qrcode } from "html5-qrcode";

// 型定義
type Item = {
  id: string;
  name: string;
  price: number;
};

// コンポーネントが受け取るpropsの型定義
interface WaitingManagerProps {
  storeid: string;
}

export default function WaitingManager({ storeid }: WaitingManagerProps) {
  // ★ storeId の useState は不要に
  // const [storeId, setStoreId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
  const [callQueues, setCallQueues] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);

  // 呼び出し待ち一覧の取得
  const fetchCallQueues = useCallback(async (currentStoreId: string) => {
    if (!currentStoreId) return;

    // ... (fetchCallQueuesのロジックは変更なし、ただし引数でstoreidを受け取る)
    const { data, error } = await supabase
      .from('call_queue')
      .select(`
        id, is_called,
        transaction:transaction_id (
          id, user_id, amount, store_id,
          details:transaction_detail (
            quantity,
            item:item_id (name, price)
          )
        )
      `)
      .order('id', { ascending: true });

    // Client-side filter (改善の余地あり: 本来はRPC関数が望ましい)
    const filtered = (data || []).filter(
      (queue: any) => queue.transaction && queue.transaction.store_id === currentStoreId
    );

    if (error) {
      console.error('呼び出し一覧取得エラー', error);
      return;
    }
    setCallQueues(filtered);
  }, []);

  // ★ useEffect のロジックを修正
  useEffect(() => {
    // storeidがpropsとして渡されていない場合は何もしない
    if (!storeid) return;

    // 商品一覧の取得
    supabase
      .from('item')
      .select('id, name, price')
      .eq('store_id', storeid)
      .then(({ data }) => setItems(data || []));

    // 呼び出し待ち一覧の取得
    fetchCallQueues(storeid);

  }, [storeid, fetchCallQueues]);

  // 購入登録処理
  const handlePurchase = async () => {
    // ★ propsのstoreidを使用
    if (!storeid || !userId) return;
    
    // ... (handlePurchaseのロジックは、storeId を storeid に置き換える以外はほぼ変更なし)
    const total = items.reduce((sum, item) => sum + (selectedItems[item.id] || 0) * item.price, 0);
    const { data: transaction, error: transError } = await supabase
        .from('transaction')
        .insert([{ store_id: storeid, user_id: userId, amount: total }])
        .select().single();
    if (transError || !transaction) { alert('購入登録に失敗しました'); return; }
    
    const details = Object.entries(selectedItems)
        .filter(([, qty]) => qty > 0)
        .map(([itemId, qty]) => ({ transaction_id: transaction.id, item_id: itemId, quantity: qty }));
    const { error: detailError } = await supabase.from('transaction_detail').insert(details);
    if (detailError) { alert('商品詳細登録に失敗しました'); return; }
    
    const { error: queueError } = await supabase.from('call_queue').insert([{ transaction_id: transaction.id, is_called: false }]);
    if (queueError) { alert('呼び出しキュー登録に失敗しました'); return; }

    alert('登録が完了しました！');
    setUserId(null);
    setSelectedItems({});
    fetchCallQueues(storeid);
  };
  
  // QRコードスキャンの開始/停止ロジック
  const startScan = useCallback(() => {
    const qrCodeScanner = new Html5Qrcode("qr-reader");
    setHtml5QrCode(qrCodeScanner);
    setScanning(true);
    
    qrCodeScanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        setUserId(decodedText);
        stopScan(qrCodeScanner);
      },
      (errorMessage) => { /* ignore */ }
    ).catch(err => console.error("QR Scan Start Error:", err));
  }, []);

  const stopScan = (scanner?: Html5Qrcode | null) => {
    const scn = scanner || html5QrCode;
    if (scn && scn.isScanning) {
      scn.stop().then(() => {
        setScanning(false);
      }).catch(err => console.error("QR Scan Stop Error:", err));
    }
  };

  const resetUser = () => {
    setUserId(null);
    setSelectedItems({});
  }

  // UI部分
  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">お客様待ち管理</h1>

      {!storeid && <p className="text-red-500 text-center">ストア情報が取得できません。URLを確認してください。</p>}

      {storeid && !userId && (
        <section className="mb-8 p-4 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2 text-center">お客様の受付</h2>
          <div id="qr-reader" className="w-full max-w-sm mx-auto border rounded"/>
          <div className="text-center mt-4">
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              onClick={startScan}
              disabled={scanning}
            >
              {scanning ? "カメラ起動中..." : "QRコードを読み取る"}
            </button>
            {scanning && <button className="ml-2 bg-gray-500 text-white px-5 py-2 rounded-lg" onClick={() => stopScan()}>停止</button>}
          </div>
        </section>
      )}

      {storeid && userId && (
        <section className="mb-8 p-4 border rounded-lg shadow-sm bg-blue-50">
          <h2 className="text-xl font-semibold mt-4">購入商品を選択（お客様ID: {userId}）</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
            {items.map((item) => (
              <div key={item.id} className="p-3 border rounded-md bg-white">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">¥{item.price}</p>
                <input
                  type="number" min={0}
                  value={selectedItems[item.id] || 0}
                  onChange={(e) => setSelectedItems({ ...selectedItems, [item.id]: parseInt(e.target.value) || 0 })}
                  className="mt-2 w-full border px-2 py-1 rounded"
                />
              </div>
            ))}
          </div>
          <button onClick={handlePurchase} className="bg-green-600 text-white px-4 py-2 rounded mr-2 hover:bg-green-700">購入登録</button>
          <button onClick={resetUser} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">キャンセル</button>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4 text-center">呼び出しキュー</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div id="waiting-queue">
            <h3 className="font-semibold text-lg mb-2 text-center text-red-600">▼ 待ち</h3>
            {callQueues.filter((q) => !q.is_called).length === 0 ? <p className="text-center text-gray-500">待ちはありません。</p> : (
              <ul className="space-y-4">
                {callQueues.filter((q) => !q.is_called).map((queue) => (
                  <li key={queue.id} className="border p-4 rounded-lg bg-white shadow">
                    <p className="font-bold text-lg">お客様ID: {queue.transaction.user_id}</p>
                    <p className="mt-1 font-semibold">合計: ¥{queue.transaction.amount.toLocaleString()}</p>
                    <ul className="text-sm text-gray-700 mt-2 ml-4 list-disc list-inside">
                      {queue.transaction.details.map((d: any, i: number) => <li key={i}>{d.item.name} × {d.quantity}</li>)}
                    </ul>
                    <div className="mt-4 flex gap-2">
                        <button className="w-full bg-green-600 text-white px-3 py-2 rounded-lg" onClick={async () => { await supabase.from('call_queue').update({ is_called: true }).eq('id', queue.id); fetchCallQueues(storeid); }}>呼び出し</button>
                        <button className="w-full bg-red-600 text-white px-3 py-2 rounded-lg" onClick={async () => { if(confirm('本当に削除しますか？')) { await supabase.from('call_queue').delete().eq('id', queue.id); fetchCallQueues(storeid); }}}>削除</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div id="called-queue">
            <h3 className="font-semibold text-lg mb-2 text-center text-blue-600">▼ 呼び出し中</h3>
             {callQueues.filter((q) => q.is_called).length === 0 ? <p className="text-center text-gray-500">呼び出し中はありません。</p> : (
              <ul className="space-y-4">
                {callQueues.filter((q) => q.is_called).map((queue) => (
                  <li key={queue.id} className="border p-4 rounded-lg bg-yellow-50 shadow opacity-70">
                    <p className="font-bold">お客様ID: {queue.transaction.user_id}</p>
                    <p className="mt-1 font-semibold">合計: ¥{queue.transaction.amount.toLocaleString()}</p>
                    <div className="mt-4">
                        <button className="w-full bg-gray-500 text-white px-3 py-2 rounded-lg" onClick={async () => { if(confirm('本当に削除しますか？')) { await supabase.from('call_queue').delete().eq('id', queue.id); fetchCallQueues(storeid); }}}>完了（削除）</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}