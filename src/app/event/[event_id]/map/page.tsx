'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import MapTabs from '@/components/MapTabs';
import MapContainer from '@/components/MapContainer';

// Map情報の型定義
export type MapInfo = {
    id: string;
    image: string; // 元のファイル名
    publicUrl: string; // 表示用の公開URL
};

export default function Page() {
    const [maps, setMaps] = useState<MapInfo[]>([]);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { event_id } = useParams();


    // event_id を元に、関連する地図のリストを取得します
    useEffect(() => {
        if (!event_id) return;

        const fetchMapImages = async () => {
            setLoading(true);
            const { data: mapDataList, error } = await supabase
                .from('map')
                .select('id, image')
                .eq('event_id', event_id);

            if (error) {
                console.error('Error fetching maps:', error.message);
                setLoading(false);
                return;
            }

            if (Array.isArray(mapDataList)) {
                // Supabaseストレージから公開URLを取得する処理を並列化します
                const mapInfoPromises = mapDataList.map(async (mapData) => {
                    const { data: urlData } = await supabase.storage.from('image-bucket').getPublicUrl(mapData.image);
                    return { ...mapData, publicUrl: urlData.publicUrl || '' };
                });
                const resolvedMaps = await Promise.all(mapInfoPromises);
                setMaps(resolvedMaps.filter(map => map.publicUrl));
            }
            setLoading(false);
        };

        fetchMapImages();
    }, [event_id]);

    // 現在アクティブな地図の情報を取得
    const activeMap = maps[activeTab];

    // ローディング中の表示
    if (loading) {
        return <div className="p-8 text-center animate-pulse">地図情報を読み込み中...</div>;
    }

    // 地図データが一つもなかった場合の表示
    if (!loading && maps.length === 0) {
        return <div className="p-8 text-center">このイベントに登録されている地図はありません。</div>;
    }

    return (
        <main className="p-4 md:p-6">
            <h1 className="text-2xl font-bold mb-4">学際マップ</h1>
            <button
                className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                onClick={() => router.push('/event')}
            >
                イベント一覧に戻る
            </button>

            {/* タブ表示コンポーネントを呼び出し */}
            <MapTabs
                maps={maps}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* 地図とピンの管理コンポーネントを呼び出し */}
            {activeMap && (
                <MapContainer
                    key={activeMap.id}
                    mapId={activeMap.id}
                    imageUrl={activeMap.publicUrl}
                />
            )}
        </main>
    );
}