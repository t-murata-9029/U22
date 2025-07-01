import { Suspense } from 'react';
import EventDashboard from '@/components/EventDashboard'; // 先ほど作成したクライアントコンポーネントをインポート

// ページのpropsの型
type DashboardPageProps = {
    params: {
        event_id: string;
    };
};

// このファイルからは 'use client'; を削除します
export default function Page({ params }: DashboardPageProps) {
    const awaitedParams = params;
    const { event_id } = awaitedParams;

    return (
        // Suspenseは、クライアントコンポーネントの読み込み中にフォールバックUIを表示するために使用します
        <Suspense fallback={<div style={{ padding: '24px' }}>読み込み中...</div>}>
            <EventDashboard event_id={event_id} />
        </Suspense>
    );
}