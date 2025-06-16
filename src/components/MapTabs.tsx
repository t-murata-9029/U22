'use client';

import type { MapInfo } from '@/app/event/[event_id]/map/page'; // 型をインポート

type MapTabsProps = {
    maps: Omit<MapInfo, 'image'>[]; // このコンポーネントはidとpublicUrlだけあれば良い
    activeTab: number;
    onTabChange: (index: number) => void;
};

export default function MapTabs({ maps, activeTab, onTabChange }: MapTabsProps) {
    if (maps.length <= 1) {
        return null; // 地図が1つ以下の場合はタブ不要
    }

    return (
        <div className="flex flex-wrap gap-1 mb-4 border-b">
            {maps.map((_, idx) => (
                <button
                    key={idx}
                    className={`px-4 py-2 text-sm md:text-base rounded-t-md transition-colors ${activeTab === idx ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    onClick={() => onTabChange(idx)}
                >
                    地図 {idx + 1}
                </button>
            ))}
        </div>
    );
}