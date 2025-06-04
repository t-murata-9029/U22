'use client';
import Link from 'next/link';

export default function DashboardPage() {
    return (
        <main className="p-4">
            <h1 className="text-2xl font-bold mb-4">ダッシュボード</h1>

            <ul className="space-y-2">
                <li>
                    <Link href="/store/items" className="block bg-blue-500 text-white px-4 py-2 rounded">
                        商品管理
                    </Link>
                </li>
                <li>
                    <Link href="/store/sales" className="block bg-green-500 text-white px-4 py-2 rounded">
                        売上履歴
                    </Link>
                </li>
                <li>
                    <Link href="/store/summary" className="block bg-yellow-500 text-white px-4 py-2 rounded">
                        売上集計
                    </Link>
                </li>
                <li>
                    <Link href="/store/waiting" className="block bg-purple-500 text-white px-4 py-2 rounded">
                        お客様待ち管理
                    </Link>
                </li>
            </ul>
        </main>
    );
}
