// app/store/[storeid]/sales/page.tsx

import SalesHistory from '@/components/SalesHistory';

// このページが受け取るURLパラメータの型を定義
type SalesPageProps = {
  params: {
    storeid: string; // ディレクトリ名 [storeid] と一致
  };
};

// このページはサーバーコンポーネントです
export default async function Page({ params }: SalesPageProps) {
  // URLのパスから storeid を取得
  const { storeid } = params;

  // 取得した storeid をクライアントコンポーネントにpropsとして渡す
  return (
    <div>
      <SalesHistory storeid={storeid} />
    </div>
  );
}