// app/EventTest/[event_id]/StoresbyEvent/page.tsx
import StoreSelectPage from '@/components/StoreSelectPage'; // パスは実際の場所に合わせてください

type PageProps = {
  params: {
    event_id: string; // ★★★ キー名を 'eventid' (小文字) に修正 ★★★
  };
};

export default async function SitStoreSelectionPage({ params }: PageProps) {
  // params オブジェクトの中身をサーバーコンソールで確認 (より安全な方法で)
  console.log('Page received params keys:', Object.keys(params).join(', '));
  if (params.event_id) {
    console.log('Value of params.eventid:', params.event_id);
  } else {
    console.log('params.eventid is not defined or falsy.');
  }

  // ★★★ 'params.eventId' を 'params.eventid' (小文字) に修正 ★★★
  const eventIdFromPath = params.event_id;

  if (!eventIdFromPath) {
    // エラーメッセージのデバッグ情報を修正
    // (JSON.stringify(params) はエラーの原因になるため、ここではより安全な情報を表示)
    let debugParamsInfo = "params object received.";
    if (params && typeof params === 'object') {
        debugParamsInfo = `Available keys in params: ${Object.keys(params).join(', ')}`;
    }
    return <p>エラー: イベントIDがURLから取得できませんでした。(params.eventid が見つからないか、空です。 {debugParamsInfo})</p>;
  }

  return (
    <div>
      <h1>デバッグ用表示: イベントIDは {eventIdFromPath} です</h1>
      <StoreSelectPage eventId={eventIdFromPath} />
    </div>
  );
}