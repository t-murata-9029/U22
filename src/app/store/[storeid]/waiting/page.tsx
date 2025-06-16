// app/store/[storeid]/waiting/page.tsx

import WaitingManager from '@/components/WaitingManager';

// このページが受け取るURLパラメータの型を定義
type WaitingPageProps = {
  params: {
    storeid: string; // ディレクトリ名 [storeid] と一致
  };
};

// このページはサーバーコンポーネントです
export default async function Page({ params }: WaitingPageProps) {
  // URLのパスから storeid を取得
  const { storeid } = params;

  // 取得した storeid をクライアントコンポーネントにpropsとして渡す
  return (
    <div>
      <WaitingManager storeid={storeid} />
    </div>
  );
}