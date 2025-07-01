// app/store/[storeid]/sales/page.tsx

import SalesHistory from '@/components/SalesHistory';

// このページが受け取るURLパラメータの型を定義
import { useParams } from 'next/navigation';


// このページはサーバーコンポーネントです
export default async function Page( ){
const params = useParams();
  let storeid = '';
  if(params.storeid === 'string') {
    storeid = params.storeid;
  }


  // 取得した storeid をクライアントコンポーネントにpropsとして渡す
  return (
    <div>
      <SalesHistory storeid={storeid} />
    </div>
  );
}