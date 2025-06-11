'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function EventMapPage() {
    const [maps, setMaps] = useState<{ id: string; image: string }[]>([]);
    const [mapUrls, setMapUrls] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState(0);
    const [pins, setPins] = useState<any[]>([]);
    const [adding, setAdding] = useState(false);
    const [newPinName, setNewPinName] = useState('');
    const [newPinDesc, setNewPinDesc] = useState('');
    const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
    const router = useRouter();
    const eventId = '725a569c-4242-4d91-853e-c7391d3b6e72';
    const mapId = maps[activeTab]?.id;
    const imageRef = React.useRef<HTMLImageElement>(null);

    useEffect(() => {
        const fetchMapImages = async () => {
            const { data: mapDataList } = await supabase
                .from('map')
                .select('id, image')
                .eq('event_id', eventId);

            if (Array.isArray(mapDataList)) {
                setMaps(mapDataList);
                const urls: string[] = [];
                for (const mapData of mapDataList) {
                    if (mapData?.image) {
                        const { data } = await supabase
                            .storage
                            .from('image-bucket')
                            .getPublicUrl(mapData.image);
                        if (data?.publicUrl) {
                            urls.push(data.publicUrl);
                        }
                    }
                }
                setMapUrls(urls);
            }
        };
        fetchMapImages();
    }, [eventId]);

    useEffect(() => {
        const fetchPins = async () => {
            if (!mapId) return;
            const { data: pinData } = await supabase
                .from('map_pin')
                .select('*')
                .eq('map_id', mapId);
            if (Array.isArray(pinData)) {
                setPins(pinData);
            }
        };
        fetchPins();
    }, [mapId]);

    const handleAddPin = async (e: React.MouseEvent<HTMLImageElement>) => {
        if (!adding || !imageRef.current) return;
        if (!newPinName) {
            alert('店舗名を入力してください');
            return;
        }
        const rect = imageRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const { data, error } = await supabase
            .from('map_pin')
            .insert([{ x, y, map_id: mapId, name: newPinName, description: newPinDesc }])
            .select()
            .single();
        if (!error && data) {
            setPins([...pins, data]);
        }
        setAdding(false);
        setNewPinName('');
        setNewPinDesc('');
    };

    const handleDeletePin = async (pinId: string) => {
        await supabase
            .from('map_pin')
            .delete()
            .eq('id', pinId);
        setPins(pins.filter(pin => pin.id !== pinId));
    };

    return (
        <main className="p-4">
            <h1 className="text-xl font-bold mb-4">学際マップ</h1>
            {/* マップ一覧に戻るボタン */}
            <button
                className="mb-4 px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => router.push('/event')}
            >
                マップ一覧に戻る
            </button>
            {mapUrls.length > 1 && (
                <div className="flex gap-2 mb-4">
                    {mapUrls.map((_, idx) => (
                        <button
                            key={idx}
                            className={`px-4 py-2 rounded ${activeTab === idx ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                            onClick={() => setActiveTab(idx)}
                        >
                            地図{idx + 1}
                        </button>
                    ))}
                </div>
            )}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 800,
                    aspectRatio: '16/9',
                    margin: '0 auto'
                }}
            >
                {mapUrls.length > 0 ? (
                    <img
                        ref={imageRef}
                        src={mapUrls[activeTab]}
                        alt="学際マップ"
                        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }}
                        onClick={adding ? handleAddPin : undefined}
                    />
                ) : (
                    <div>地図画像を読み込み中...</div>
                )}
                {pins.map((pin) => (
                    <div
                        key={pin.id}
                        style={{
                            position: 'absolute',
                            left: `${pin.x * 100}%`,
                            top: `${pin.y * 100}%`,
                            transform: 'translate(-50%, -100%)',
                            zIndex: 2
                        }}
                    >
                        <div
                            style={{
                                background: 'red',
                                borderRadius: '50%',
                                width: 24,
                                height: 24,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                            title={pin.name || 'ピン'}
                            onClick={() => setSelectedPinId(pin.id === selectedPinId ? null : pin.id)} // ← 削除ではなく説明表示
                        >
                            ×
                        </div>
                        {selectedPinId === pin.id && (pin.name || pin.description) && (
                            <div
                                style={{
                                    background: 'white',
                                    border: '1px solid #ccc',
                                    borderRadius: 8,
                                    padding: '4px 8px',
                                    marginTop: 4,
                                    fontSize: 12,
                                    minWidth: 80,
                                    textAlign: 'center'
                                }}
                            >
                                {pin.name && <strong>{pin.name}</strong>}
                                {pin.description && <div>{pin.description}</div>}
                                <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>ピンを再クリックで閉じる</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {mapUrls.length > 0 && (
                <button
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
                    onClick={() =>
                        router.push(
                            `/event/mappin?mapId=${maps[activeTab]?.id}&imageUrl=${encodeURIComponent(mapUrls[activeTab])}`
                        )
                    }
                >
                    ピン編集
                </button>
            )}
            {/* ピン追加モード時のフォーム */}
            {adding && (
                <div className="mb-4 flex gap-2 items-end">
                    <div>
                        <label className="block text-sm">店舗名</label>
                        <input
                            type="text"
                            value={newPinName}
                            onChange={e => setNewPinName(e.target.value)}
                            className="border px-2 py-1 rounded"
                            placeholder="例: 模擬店A"
                        />
                    </div>
                    <div>
                        <label className="block text-sm">説明</label>
                        <input
                            type="text"
                            value={newPinDesc}
                            onChange={e => setNewPinDesc(e.target.value)}
                            className="border px-2 py-1 rounded"
                            placeholder="例: 焼きそば販売"
                        />
                    </div>
                    <span className="text-gray-600 text-sm">画像をクリックしてピンを追加</span>
                </div>
            )}
        </main>
    );
}