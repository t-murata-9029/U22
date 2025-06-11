// app/store/[storeid]/items/page.tsx

import ItemsManager from '@/components/ItemsManager';


// このページが受け取るURLパラメータの型を定義
type ItemsPageProps = {
  params: {
    storeid: string; // ディレクトリ名 [storeid] と一致
  };
};

// このページはサーバーコンポーネントです
export default async function Page({ params }: ItemsPageProps) {
  // URLのパスから storeid を取得
  const { storeid } = params;

  // 取得した storeid をクライアントコンポーネントにpropsとして渡す
  return (
    <div>
      <ItemsManager storeid={storeid} />
    </div>
  );
}