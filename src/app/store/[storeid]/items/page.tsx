// app/store/[storeid]/items/page.tsx

import ItemsManager from '@/components/ItemsManager';
import { useParams } from 'next/navigation';




// このページはサーバーコンポーネントです
export default async function Page() {

  const params = useParams();
  let storeid = '';
  if(params.storeid === 'string') {
    storeid = params.storeid;
  }


  // 取得した storeid をクライアントコンポーネントにpropsとして渡す
  return (
    <div>
      <ItemsManager storeid={storeid} />
    </div>
  );
}