'use client'
import SalesSummary from '@/components/SalesSummary';
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams();

  const storeid = params.storeid as string; 

  // 取得した storeid をクライアントコンポーネントにpropsとして渡す
  return (
    <div>
      <SalesSummary storeid={storeid} />
    </div>
  );
}