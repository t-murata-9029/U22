// app/store/[storeid]/summary/SalesSummary.tsx

'use client';

import { useEffect, useState, useMemo } from 'react'; // ★ useMemo をインポート
import { supabase } from '@/lib/supabase';
// ★ グラフ用のコンポーネントとChart.js本体をインポート
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// ★ Chart.jsに必要なモジュールを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// 型定義 (変更なし)
type Summary = {
  item_id: string;
  name: string;
  total_quantity: number;
  total_amount: number;
};
interface SalesSummaryProps {
  storeid: string;
}

export default function SalesSummary({ storeid }: SalesSummaryProps) {
  const [summary, setSummary] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);

  // データ取得ロジック (変更なし)
  useEffect(() => {
    if (!storeid) {
      setLoading(false);
      return;
    }
    const fetchSummary = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_sales_summary_by_item', {
        target_store_id: storeid,
      });
      if (error) {
        console.error('売上集計の取得に失敗しました:', error);
        setSummary([]);
      } else {
        // 売上合計が多い順にソートしてセット
        const sortedData = (data || [])  .sort((a: Summary, b: Summary) => b.total_amount - a.total_amount);
        setSummary(sortedData);
      }
      setLoading(false);
    };
    fetchSummary();
  }, [storeid]);

  // ★ 全体の合計販売数と合計金額を計算 (useMemoで効率化)
  const { grandTotalQuantity, grandTotalAmount } = useMemo(() => {
    return summary.reduce(
      (acc, current) => {
        acc.grandTotalQuantity += current.total_quantity;
        acc.grandTotalAmount += current.total_amount;
        return acc;
      },
      { grandTotalQuantity: 0, grandTotalAmount: 0 }
    );
  }, [summary]);

  // ★ グラフ用のデータを作成
  const chartData = {
    labels: summary.map((s) => s.name), // 商品名をラベルに
    datasets: [
      {
        label: '売上金額 (円)',
        data: summary.map((s) => s.total_amount), // 売上合計をデータに
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '商品別 売上金額',
      },
    },
  };
  
  // ローディング中の表示 (変更なし)
  if (loading) {
    return (
      <main className="p-4 md:p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">売上集計</h1>
        <p>読み込み中...</p>
      </main>
    )
  }

  return (
    <main className="p-4 md:p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">売上集計</h1>
      
      {summary.length === 0 ? (
        <p>集計データはありません。</p>
      ) : (
        <div className="space-y-12">
          {/* ★ 全体合計の表示エリア */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-600">総売上金額</h2>
              <p className="text-4xl font-bold mt-2">&yen;{grandTotalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-600">総販売数</h2>
              <p className="text-4xl font-bold mt-2">{grandTotalQuantity.toLocaleString()} 個</p>
            </div>
          </section>

          {/* ★ グラフ表示エリア */}
          <section className="bg-white p-4 sm:p-6 rounded-lg shadow">
             <Bar options={chartOptions} data={chartData} />
          </section>

          {/* ★ 表表示エリア */}
          <section>
            <h2 className="text-2xl font-bold mb-4">詳細データ</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full">
                {/* ... thead と tbody は変更なし ... */}
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品名</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">販売数</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">売上合計</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {summary.map((s) => (
                    <tr key={s.item_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{s.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700">{s.total_quantity.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700">&yen;{s.total_amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}