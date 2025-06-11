// app/EventTest/[eventid]/create/page.tsx

import EventUploadForm from '@/components/EventUploadForm';

// このページが受け取るURLパラメータの型を定義
type CreatePageProps = {
  params: {
    eventid: string; // ディレクトリ名 [eventid] と一致
  };
};

// このページはサーバーコンポーネントです
export default async function Page({ params }: CreatePageProps) {
  // URLのパスから eventid を取得
  const { eventid } = params;

  // 取得した eventid をクライアントコンポーネントにpropsとして渡す
  return (
    <div>
      <EventUploadForm eventid={eventid} />
    </div>
  );
}