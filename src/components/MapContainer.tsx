'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import PinComponent, { Pin } from '@/components/Pin';

type MapContainerProps = {
    mapId: string;
    imageUrl: string;
};

export default function MapContainer({ mapId, imageUrl }: MapContainerProps) {
    const [pins, setPins] = useState<Pin[]>([]);
    const [adding, setAdding] = useState(false);
    const [newPinName, setNewPinName] = useState('');
    const [newPinDesc, setNewPinDesc] = useState('');
    const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const fetchPins = async () => {
            const { data, error } = await supabase.from('map_pin').select('*').eq('map_id', mapId);
            if (error) console.error('Error fetching pins:', error);
            else if (Array.isArray(data)) setPins(data);
        };
        fetchPins();
    }, [mapId]);

    const handleAddPin = async (e: React.MouseEvent<HTMLImageElement>) => {
        if (!adding || !imageRef.current) return;
        if (!newPinName) { alert('店舗名を入力してください'); return; }
        const rect = imageRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const { data, error } = await supabase
            .from('map_pin').insert([{ x, y, map_id: mapId, name: newPinName, description: newPinDesc }])
            .select().single();
        if (!error && data) setPins([...pins, data]);
        setNewPinName('');
        setNewPinDesc('');
    };

    const handleDeletePin = async (pinId: string) => {
        if (!window.confirm('このピンを削除しますか？')) return;
        const { error } = await supabase.from('map_pin').delete().eq('id', pinId);
        if (!error) {
            setPins(pins.filter(p => p.id !== pinId));
            setSelectedPinId(null);
        } else {
            alert('削除に失敗しました。');
        }
    };

    return (
        <div>
            <div className="mb-4">
                <button onClick={() => setAdding(!adding)} className={`px-4 py-2 text-white rounded transition-colors ${adding ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}>
                    {adding ? 'ピン追加を終了' : 'ピン追加モードを開始'}
                </button>
            </div>
            {adding && (
                 <div className="p-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                    <p className="font-bold text-blue-800">ピン追加モード</p>
                    <div className="flex flex-wrap gap-4 items-end">
                        <input value={newPinName} onChange={e => setNewPinName(e.target.value)} placeholder="店舗名" className="border px-2 py-1 rounded"/>
                        <input value={newPinDesc} onChange={e => setNewPinDesc(e.target.value)} placeholder="説明" className="border px-2 py-1 rounded"/>
                    </div>
                    <p className="text-sm text-gray-600">情報を入力後、地図上の配置したい場所をクリックしてください。</p>
                 </div>
            )}
            <div style={{ position: 'relative', width: '100%', maxWidth: 800, margin: '0 auto', border: '1px solid #ddd' }}>
                <img ref={imageRef} src={imageUrl} alt="地図" style={{ width: '100%', cursor: adding ? 'crosshair' : 'default' }} onClick={adding ? handleAddPin : undefined} />
                {pins.map((pin) => (
                    <PinComponent key={pin.id} pin={pin} isSelected={selectedPinId === pin.id} onSelect={() => { if (!adding) setSelectedPinId(selectedPinId === pin.id ? null : pin.id); }} onDelete={handleDeletePin} />
                ))}
            </div>
        </div>
    );
}