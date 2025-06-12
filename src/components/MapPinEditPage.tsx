'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

// ピンのデータ構造を定義する型
type MapPin = {
    id: string;
    x: number;
    y: number;
    map_id: string;
    name: string | null;
    description: string | null;
};

// このコンポーネントが親から受け取るprops（プロパティ）の型を定義
type MapPinEditPageProps = {
    mapId: string;
    imageUrl: string;
};

export default function MapPinEditPage({ mapId, imageUrl }: MapPinEditPageProps) {
    // ---- State管理 ----
    // データベースから取得したピンのリスト
    const [pins, setPins] = useState<MapPin[]>([]);
    // 現在「ピン追加モード」かどうか (true/false)
    const [adding, setAdding] = useState(false);
    // 新しく追加するピンの名前
    const [newPinName, setNewPinName] = useState('');
    // 新しく追加するピンの説明
    const [newPinDesc, setNewPinDesc] = useState('');
    // HTMLのimg要素を直接参照するために使用
    const imageRef = useRef<HTMLImageElement>(null);

    // ---- データ取得 Effect ----
    // ページ表示時、またはmapIdが変更された時にピンの一覧を取得する
    useEffect(() => {
        if (!mapId) return; // mapIdがなければ処理を中断

        const fetchPins = async () => {
            const { data, error } = await supabase
                .from('map_pin')
                .select('*')
                .eq('map_id', mapId);

            if (error) {
                console.error('Error fetching pins:', error);
                alert('ピン情報の読み込みに失敗しました。');
            } else if (Array.isArray(data)) {
                setPins(data);
            }
        };
        fetchPins();
    }, [mapId]);

    // ---- イベントハンドラ（関数） ----
    // 地図画像がクリックされたときに、新しいピンを追加する関数
    const handleAddPin = async (e: React.MouseEvent<HTMLImageElement>) => {
        if (!adding || !imageRef.current) return;

        if (!newPinName) {
            alert('ピンの名前を入力してください。');
            return;
        }

        const rect = imageRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const { data, error } = await supabase
            .from('map_pin')
            .insert([{
                x,
                y,
                map_id: mapId,
                name: newPinName,
                description: newPinDesc
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding pin:', error);
            alert('ピンの追加に失敗しました。');
        } else if (data) {
            setPins([...pins, data]);
            setNewPinName('');
            setNewPinDesc('');
        }

        // ピン追加処理の後、自動で追加モードを終了する
        setAdding(false);
    };

    // 既存のピンがクリックされたときに、そのピンを削除する関数
    const handleDeletePin = async (id: string) => {
        if (window.confirm('このピンを本当に削除しますか？')) {
            const { error } = await supabase.from('map_pin').delete().eq('id', id);

            if (error) {
                console.error('Error deleting pin:', error);
                alert('ピンの削除に失敗しました。');
            } else {
                setPins(pins.filter((p) => p.id !== id));
            }
        }
    };

    // ---- レンダリングされるUI (JSX) ----
    return (
        <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">ピン一括編集</h2>
            <p className="text-sm text-gray-600 mb-4">このページでは、ピンの追加と削除ができます。</p>
            <button
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded transition-colors disabled:bg-gray-400"
                onClick={() => setAdding(true)} // ボタンを押すと追加モードをオンにする
                disabled={adding} // 追加モード中はボタンを押せなくする
            >
                {adding ? '画像をクリックしてピンを追加...' : 'ピンを追加する'}
            </button>

            {/* ピン追加モードの時に表示される入力フォーム */}
            {adding && (
                <div className="p-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="font-bold text-blue-800 mb-2">ピン追加モード</p>
                    <div className="flex flex-wrap gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">ピンの名前</label>
                            <input
                                type="text"
                                value={newPinName}
                                onChange={e => setNewPinName(e.target.value)}
                                className="border px-2 py-1 rounded w-full"
                                placeholder="例: 模擬店A"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">説明</label>
                            <input
                                type="text"
                                value={newPinDesc}
                                onChange={e => setNewPinDesc(e.target.value)}
                                className="border px-2 py-1 rounded w-full"
                                placeholder="例: 焼きそば販売"
                            />
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">情報を入力後、地図上の配置したい場所をクリックしてください。</p>
                </div>
            )}

            {/* 地図とピンを表示するコンテナ */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 800,
                    aspectRatio: '16/9',
                    margin: '0 auto',
                    border: '1px solid #ccc',
                }}
            >
                <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="地図"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        borderRadius: 8,
                        cursor: adding ? 'crosshair' : 'default'
                    }}
                    onClick={adding ? handleAddPin : undefined}
                />
                {pins.map((pin) => (
                    <div
                        key={pin.id}
                        style={{
                            position: 'absolute',
                            left: `${pin.x * 100}%`,
                            top: `${pin.y * 100}%`,
                            transform: 'translate(-50%, -50%)',
                            zIndex: 2,
                        }}
                    >
                        <div
                            style={{
                                background: 'red',
                                border: '2px solid white',
                                borderRadius: '50%',
                                width: 24,
                                height: 24,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                            }}
                            title={pin.name || 'このピンを削除'}
                            onClick={() => {
                                if (!adding) {
                                    handleDeletePin(pin.id);
                                } else {
                                    alert('ピン追加モード中は削除できません。');
                                }
                            }}
                        >
                            ×
                        </div>
                    </div>
                ))}
            </div>
            <p className="mt-4 text-gray-600">
                「ピンを追加する」ボタンを押すとピンを追加できます。既存のピンをクリックすると削除できます。
            </p>
        </div>
    );
}