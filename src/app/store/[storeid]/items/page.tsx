// app/store/[storeid]/items/page.tsx
'use client'
import ItemsManager from '@/components/ItemsManager';
import { useParams } from 'next/navigation';


// このページはサーバーコンポーネントです
export default function Page() {
  const params = useParams();
  const storeid = params.storeid as string;

  // 取得した storeid をクライアントコンポーネントにpropsとして渡す
  return (
    <div>
      <ItemsManager storeid={storeid} />
    </div>
  );
}