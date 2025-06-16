'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // supabaseクライアントのパスはプロジェクトに合わせてください

// Store型の定義を更新
type Store = {
  id: string;          // ストアのID
  event_id: string;    // イベントID
  name: string;        // ストア名
  image?: string | null; // Supabaseのテーブルに保存されている画像ファイル名 (実際のカラム名に置き換えてください)
  imageUrl?: string;   // 取得した画像の公開URL
};

// コンポーネントのPropsに表示対象のイベントIDを追加
interface CustomerStoreListPageProps {
  eventId: string;
}

// !!! 実際のSupabase Storageのバケット名に置き換えてください !!!
const BUCKET_NAME = 'image-bucket'; // 例: 'store-images'

export default function CustomerStoreListPage({ eventId }: CustomerStoreListPageProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      setErrorMsg("イベントIDが指定されていません。");
      setStores([]);
      return;
    }

    const fetchStoresAndImages = async () => {
      setLoading(true);
      setErrorMsg(null);

      // 1. ストア情報を取得 (event_idでフィルタリングし、画像ファイル名も取得)
      // !!! 'image' は実際のカラム名に置き換えてください !!!
      const { data: storeData, error: storeError } = await supabase
        .from('store')
        .select('id, name, event_id, image') // 画像ファイル名を保存しているカラム名
        .eq('event_id', eventId);

      if (storeError) {
        console.error('ストア一覧取得エラー:', storeError.message);
        setErrorMsg(`ストア情報の取得に失敗しました: ${storeError.message}`);
        setStores([]);
        setLoading(false);
        return;
      }

      if (!storeData || storeData.length === 0) {
        setStores([]);
        setLoading(false);
        return;
      }

      // 2. 各ストアの画像URLを取得
      const storesWithImagesPromises = storeData.map(async (store) => {
        let imageUrl: string | undefined = undefined;
        // image が存在し、空文字列でない場合のみURLを取得
        if (store.image && typeof store.image === 'string' && store.image.trim() !== '') {
          // !!! Storage内の画像のパス構造に合わせて調整してください !!!
          // 例: 'public/' + store.image や store.image のみなど
          const imagePath = store.image;
          const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(imagePath);

          if (publicUrlData) {
            imageUrl = publicUrlData.publicUrl;
          } else {
            console.warn(`画像URLの取得に失敗: ${store.name} (ファイル名/パス: ${imagePath})`);
          }
        }
        return { ...store, imageUrl };
      });

      const storesWithImages = await Promise.all(storesWithImagesPromises);

      setStores(storesWithImages);
      setLoading(false);
    };

    fetchStoresAndImages();
  }, [eventId]); // eventIdが変更されたら再フェッチ

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = event.currentTarget;
    target.style.display = 'none'; // 画像を非表示にする
    const placeholder = document.createElement('div');
    placeholder.className = "w-full h-48 bg-gray-200 flex items-center justify-center mb-3 rounded-md";
    placeholder.innerHTML = '<p class="text-gray-500 text-sm">画像表示エラー</p>';
    if (target.parentNode) {
      target.parentNode.insertBefore(placeholder, target);
    }
  };

  return (
    <main className="p-4 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        ストア一覧 (イベント: {eventId})
      </h1>

      {loading ? (
        <p className="text-center text-gray-600 text-lg py-10">読み込み中...</p>
      ) : errorMsg ? (
        <p className="text-center text-red-600 bg-red-100 p-4 rounded-md">{errorMsg}</p>
      ) : stores.length === 0 ? (
        <p className="text-center text-gray-700 text-lg py-10">このイベントのストアは見つかりませんでした。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stores.map((store) => (
            <div key={store.id} className="border p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow bg-white flex flex-col">
              {store.imageUrl ? (
                <img
                  src={store.imageUrl}
                  alt={`${store.name} の画像`}
                  className="w-full h-48 object-cover mb-3 rounded-md"
                  onError={handleImageError}
                />
              ) : store.image ? (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center mb-3 rounded-md">
                  <p className="text-gray-500 text-sm">画像準備中...</p>
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center mb-3 rounded-md">
                  <p className="text-gray-400 text-sm">画像なし</p>
                </div>
              )}
              <div className="flex-grow">
                <h2 className="text-xl font-semibold mb-1 text-gray-800">{store.name}</h2>
                {/* <p className="text-xs text-gray-500">イベントID: {store.event_id}</p> */}
                 <p className="text-xs text-gray-500">ID: {store.id}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}