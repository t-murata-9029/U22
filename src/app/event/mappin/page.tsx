import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import MapPinEditPage from '@/components/MapPinEditPage';

// ページが受け取るsearchParamsの型定義
type MappinPageProps = {
    searchParams: {
        mapId?: string;
        imageUrl?: string;
    };
};

// ページはサーバーコンポーネントとして定義します
export default function Page({ searchParams }: MappinPageProps) {
    const { mapId, imageUrl } = searchParams;

    // URLに必要な情報がない場合はエラーメッセージを表示
    if (!mapId || !imageUrl) {
        return (
            <main className="p-8 text-center">
                <h1 className="text-xl font-bold text-red-600">エラー</h1>
                <p className="mt-2">編集対象の地図情報が指定されていません。前のページに戻ってやり直してください。</p>
            </main>
        );
    }
    
    // クライアントコンポーネントをSuspenseで囲みます
    return (
        <main className="p-4 md:p-6">
             <h1 className="text-2xl font-bold mb-4">ピン編集</h1>
            <Suspense fallback={<div className="p-8 text-center animate-pulse">編集画面を読み込み中...</div>}>
                <MapPinEditPage 
                    mapId={mapId} 
                    imageUrl={decodeURIComponent(imageUrl)} 
                />
            </Suspense>
        </main>
    );
}