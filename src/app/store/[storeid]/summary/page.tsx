// app/store/[storeid]/summary/page.tsx

import SalesSummary from '@/components/SalesSummary';

// このページが受け取るURLパラメータの型を定義
type SummaryPageProps = {
  params: {
    storeid: string; // ディレクトリ名 [storeid] と一致
  };
};

// このページはサーバーコンポーネントです
export default async function Page({ params }: SummaryPageProps) {
  // URLのパスから storeid を取得
  const { storeid } = params;

  // 取得した storeid をクライアントコンポーネントにpropsとして渡す
  return (
    <div>
      <SalesSummary storeid={storeid} />
    </div>
  );
}