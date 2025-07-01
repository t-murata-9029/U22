'use client'

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useParams } from 'next/navigation';



// propsの型定義を storeid に合わせます
type DashboardPageProps = {
  params: {
    storeid: string; // ディレクトリ名 [storeid] に合わせます
  };
};

// ★ ページコンポーネントを async 関数に変更
export default async function DashboardPage({ params }: DashboardPageProps) {
  // paramsから storeid を取り出します
  const params = useParams();

  let storeid = '';
  if (params.storeid === 'string') {
    storeid = params.storeid;
  }

  // ★ URLのstoreidを使って、Supabaseからストア情報を取得
  const { data: store, error } = await supabase
    .from('store')
    .select('name') // nameカラムのみ取得
    .eq('id', storeid) // idがstoreidと一致するものを検索
    .single(); // 該当データが1件であることを期待

  // ストアが見つからない、またはエラーが発生した場合の表示
  if (error || !store) {
    console.error('Store fetch error:', error);
    return (
      <main className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">エラー</h1>
        <p className="text-center text-red-500">
          ストア情報の取得に失敗しました。指定されたストアが存在しない可能性があります。
        </p>
        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-500 hover:underline">ホームに戻る</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      {/* ★ h1にストア名を表示 */}
      <h1 className="text-2xl font-bold mb-4 text-center">{store.name}</h1>
      <p className="text-sm text-center text-gray-500 mb-6">ダッシュボード</p>

      <ul className="space-y-3">
        <li>
          {/* リンクのhrefには引き続き storeid を使用 */}
          <Link
            href={`/store/${storeid}/items`}
            className="block w-full bg-blue-600 text-white text-center px-4 py-3 rounded-lg hover:bg-blue-700 shadow-md transition-transform transform hover:scale-105"
          >
            商品管理
          </Link>
        </li>
        <li>
          <Link
            href={`/store/${storeid}/sales`}
            className="block w-full bg-green-600 text-white text-center px-4 py-3 rounded-lg hover:bg-green-700 shadow-md transition-transform transform hover:scale-105"
          >
            売上履歴
          </Link>
        </li>
        {/* 他のリンクも同様 */}
        <li>
          <Link
            href={`/store/${storeid}/summary`}
            className="block w-full bg-yellow-500 text-white text-center px-4 py-3 rounded-lg hover:bg-yellow-600 shadow-md transition-transform transform hover:scale-105"
          >
            売上集計
          </Link>
        </li>
        <li>
          <Link
            href={`/store/${storeid}/waiting`}
            className="block w-full bg-purple-600 text-white text-center px-4 py-3 rounded-lg hover:bg-purple-700 shadow-md transition-transform transform hover:scale-105"
          >
            お客様待ち管理
          </Link>
        </li>
      </ul>
    </main>
  );
}