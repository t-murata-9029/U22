'use client'; // 👈 ① 'use client'を追加してクライアントコンポーネントに

import { Suspense } from 'react';
import { useParams } from 'next/navigation'; // 👈 ② useParamsをインポート
import EventDashboard from '@/components/EventDashboard';



export default function Page() { 
    const params = useParams(); 
    
    // useParamsの返り値は string | string[] の可能性があるため、文字列として扱う
    const event_id = Array.isArray(params.event_id) 
        ? params.event_id[0] 
        : params.event_id;

    return (
        // Suspenseは、EventDashboardの読み込み中や内部でのデータ取得中にフォールバックUIを表示します
        <Suspense fallback={<div style={{ padding: '24px' }}>読み込み中...</div>}>
            <EventDashboard event_id={event_id as string} />
        </Suspense>
    );
}