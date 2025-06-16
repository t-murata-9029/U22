'use client';

export type Pin = {
    id: string;
    map_id: string;
    x: number;
    y: number;
    name: string | null;
    description: string | null;
};

type PinProps = {
    pin: Pin;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: (pinId: string) => void;
};

export default function PinComponent({ pin, isSelected, onSelect, onDelete }: PinProps) {
    return (
        <div style={{ position: 'absolute', left: `${pin.x * 100}%`, top: `${pin.y * 100}%`, transform: 'translate(-50%, -50%)', zIndex: isSelected ? 11 : 2, cursor: 'pointer' }} onClick={onSelect}>
            <div style={{ background: 'red', border: '2px solid white', borderRadius: '50%', width: 20, height: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.4)' }} title={pin.name || 'ピン'} />
            {isSelected && (
                <div style={{ position: 'absolute', bottom: '150%', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '8px 12px', borderRadius: 8, boxShadow: '0 4px 8px rgba(0,0,0,0.2)', minWidth: 150, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    {pin.name && <strong className="block text-lg">{pin.name}</strong>}
                    {pin.description && <div className="text-sm text-gray-600">{pin.description}</div>}
                    <button onClick={() => onDelete(pin.id)} className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">削除</button>
                </div>
            )}
        </div>
    );
}