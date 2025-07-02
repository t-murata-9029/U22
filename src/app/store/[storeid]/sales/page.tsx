'use client'
import SalesHistory from '@/components/SalesHistory';
import { useParams } from 'next/navigation';


export default function Page() {
  const params = useParams();
  const storeid = params.storeid as string;

  // 取得した storeid をクライアントコンポーネントにpropsとして渡す
  return (
    <div>
      <SalesHistory storeid={storeid} />
    </div>
  );
}