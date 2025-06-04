'use client';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { supabase } from '@/lib/supabase'; // supabaseクライアントをimport

// 任意のユーザーIDをここで指定
const FIXED_USER_ID = 'd9481baf-cc51-438d-83f3-dd31ed2e4075';

export default function CustomerQRCodePage() {
    const [userId, setUserId] = useState<string | null>(null);
    const [called, setCalled] = useState(false);

    useEffect(() => {
        // ローカル保存が不要であれば、直接セット
        setUserId(FIXED_USER_ID);

        // または localStorage を使う場合は以下（任意）
        // localStorage.setItem('user_id', FIXED_USER_ID);
    }, []);

    // 呼び出し通知の購読
    useEffect(() => {
        if (!userId) return;

        const channel = supabase
            .channel('call_queue_changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'call_queue',
                },
                async (payload) => {
                    if (payload.new.is_called) {
                        // transaction_idからuser_idを取得して判定
                        const { data, error } = await supabase
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
                </>
            ) : (
                <p>ユーザーIDが見つかりません。ページを再読み込みしてください。</p>
            )}
        </main>
    );
}
