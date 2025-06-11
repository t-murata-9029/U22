'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

type MapPin = {
    id: string;
    x: number;
    y: number;
    map_id: string;
};

export default function MapPinEditPage({ mapId, imageUrl }: { mapId: string; imageUrl: string }) {
    const [pins, setPins] = useState<MapPin[]>([]);
    const [adding, setAdding] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);

    // ピン一覧取得
    useEffect(() => {
        const fetchPins = async () => {
            const { data } = await supabase
                .from('map_pin')
                .select('*')
                .eq('map_id', mapId);
            if (Array.isArray(data)) setPins(data);
        };
        fetchPins();
    }, [mapId]);

    // 画像クリックでピン追加
    const handleAddPin = async (e: React.MouseEvent<HTMLImageElement>) => {
        if (!adding || !imageRef.current) return;
        const rect = imageRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const { data, error } = await supabase
            .from('map_pin')
            .insert([{ x, y, map_id: mapId }])
            .select()
            .single();
        if (!error && data) {
            setPins([...pins, data]);
        }
        setAdding(false);
    };

    // ピン削除
    const handleDeletePin = async (id: string) => {
        await supabase.from('map_pin').delete().eq('id', id);
        setPins(pins.filter((p) => p.id !== id));
    };

    return (
        <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">ピン編集</h2>
            <button
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => setAdding(true)}
                disabled={adding}
            >
                {adding ? '画像をクリックしてピンを追加' : 'ピンを追加'}
            </button>
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 800,
                    aspectRatio: '16/9',
                    margin: '0 auto'
                }}
            >
                <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="地図"
                    style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8, cursor: adding ? 'crosshair' : 'default' }}
                    onClick={handleAddPin}
                />
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
                            title="ピンを削除"
                            onClick={() => handleDeletePin(pin.id)}
                        >
                            ×
                        </div>
                    </div>
                ))}
            </div>
            <p className="mt-4 text-gray-600">「ピンを追加」ボタンを押してから画像をクリックするとピンを追加できます。ピンをクリックすると削除できます。</p>
        </div>
    );
}