// 例: app/events/[eventId]/page.tsx
import CustomerStoreListPage from '@/components/CustomerStoreList'; // パスは実際の構成に合わせてください

export default async function EventStoresPage({ params }: { params: { eventId: string } }) {
  const { eventId } = params;

  if (!eventId) {
    return <p>イベントIDが必要です。</p>;
  }

  return (
    <div>
      {/* ここに他のページヘッダーや情報などを配置可能 */}
      <CustomerStoreListPage eventId={eventId} />
    </div>
  );
}