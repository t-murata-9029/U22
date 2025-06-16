// app/EventTest/[eventid]/create/page.tsx

import EventUploadForm from '@/components/EventUploadForm';

// このページが受け取るURLパラメータの型を定義
type CreatePageProps = {
  params: {
    event_id: string; // ディレクトリ名 [event_id] と一致
  };
};

// このページはサーバーコンポーネントです
export default async function Page({ params }: CreatePageProps) {
  // URLのパスから eventid を取得
  const { event_id } = params;

  // 取得した eventid をクライアントコンポーネントにpropsとして渡す
  return (
    <div>
      <EventUploadForm eventid={event_id} />
    </div>
  );
}