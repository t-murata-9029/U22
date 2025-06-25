// app/store/[storeid]/waiting/page.tsx
'use client';
import { useParams } from 'next/navigation';
import WaitingManager from '@/components/WaitingManager';

// このページが受け取るURLパラメータの型を定義
type WaitingPageProps = {
  params: {
    storeid: string; // ディレクトリ名 [storeid] と一致
  };
};

// このページはサーバーコンポーネントです
export default  function Page() {
  // paramsをawaitしてからstoreidを取得
const { storeid } = useParams<WaitingPageProps['params']>();

  // 取得した storeid をクライアントコンポーネントにpropsとして渡す
  return (
    <div>
      <WaitingManager storeid={storeid} />
    </div>
  );
}