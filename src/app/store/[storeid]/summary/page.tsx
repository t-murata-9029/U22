// app/store/[storeid]/summary/page.tsx

import SalesSummary from '@/components/SalesSummary';

import { useParams } from 'next/navigation';


// このページはサーバーコンポーネントです
export default  function Page() {
  const params = useParams();
  let storeid = '';
  if(params.storeid === 'string') {
    storeid = params.storeid;
  }

  // 取得した storeid をクライアントコンポーネントにpropsとして渡す
  return (
    <div>
      <SalesSummary storeid={storeid} />
    </div>
  );
}