'use client'

import { Suspense } from 'react';
import EventDashboard from '@/components/EventDashboard'; // 先ほど作成したクライアントコンポーネントをインポート
import { useParams } from 'next/navigation';

// このファイルからは 'use client'; を削除します
export default function Page() {
    const params = useParams();
    let event_id = "";
    if (typeof params.event_id === 'string') {
        event_id = params.event_id;
    }

    return (
        // Suspenseは、EventDashboardの読み込み中や内部でのデータ取得中にフォールバックUIを表示します
        <Suspense fallback={<div style={{ padding: '24px' }}>読み込み中...</div>}>
            <EventDashboard event_id={event_id as string} />
        </Suspense>
    );
}