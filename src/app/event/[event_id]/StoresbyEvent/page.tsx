'use client'

import StoreSelectPage from '@/components/StoreSelectPage';
import { useParams } from 'next/navigation';

export default function SitStoreSelectionPage() {
  const params = useParams();

 
  const event_id = typeof params.event_id === 'string' ? params.event_id : '';

  // event_idが取得できない場合のフォールバック表示
  if (!event_id) {
    return <p>イベントIDを読み込んでいます...</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">イベントID: {event_id} のストア一覧</h1>
      <StoreSelectPage eventId={event_id} />
    </div>
  );
}