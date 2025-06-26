'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './EventDashboard.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

// --- 型定義 ---
// データベース関数から返されるデータの型
interface DashboardData {
    event_name: string;
    event_description: string;
    map_image_filename: string | null;
    total_sales: number;
    total_transactions: number;
    average_order_value: number;
    popular_stores: {
        name: string;
        sales: number;
    }[] | null;
}

// --- ヘルパー関数 ---
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
};

// --- UIコンポーネント ---
export default function EventDashboard({ event_id }: { event_id: string }) {
    // --- State管理 ---
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [mapImageUrl, setMapImageUrl] = useState<string | null>(null);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- URL定義 ---
    const mapUrl = `/event/${event_id}/map`;
    const storeCreateUrl = `/event/${event_id}/create`;
    const storeDashboardUrl = `/event/${event_id}/StoresbyEvent`;

    // --- イベントハンドラ ---
    const handleCopyUrl = (key: string, urlPath: string) => {
        const fullUrl = `${window.location.origin}${urlPath}`;
        navigator.clipboard.writeText(fullUrl).then(() => {
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 2000);
        }).catch(err => {
            console.error('URLのコピーに失敗しました:', err);
            alert('URLのコピーに失敗しました。');
        });
    };

    const handleMapUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadError(null);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${uuidv4()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('image-bucket')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { error: insertError } = await supabase
                .from('map')
                .insert([{ event_id, image: fileName, name: file.name }]);

            if (insertError) throw insertError;

            // 成功時はページをリロードして最新の情報を表示
            alert('地図のアップロードに成功しました！');
            window.location.reload();

        } catch (err: any) {
            setUploadError(err.message || 'アップロードに失敗しました');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    // --- データ取得ロジック ---
    useEffect(() => {
        if (!event_id) return;

        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. RPC関数で基本データを取得
                const { data, error: rpcError } = await supabase.rpc('get_dashboard_data', {
                    p_event_id: event_id,
                });
                if (rpcError) throw new Error(rpcError.message || 'データベース関数の呼び出しに失敗しました。');
                if (!data) throw new Error("イベントデータが見つかりませんでした。");

                setDashboardData(data);

                // 2. 取得したファイル名から画像の公開URLを生成
                if (data.map_image_filename) {
                    const { data: urlData } = supabase
                        .storage
                        .from('image-bucket')
                        .getPublicUrl(data.map_image_filename);
                    setMapImageUrl(urlData.publicUrl);
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                    console.error("Failed to fetch dashboard data:", err);
                } else {
                    console.error("想定外のえらーおきたよ")
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [event_id]);

    // --- レンダリング前の状態管理 ---
    if (loading) return <div className={styles.container}><p>ダッシュボードデータを読み込み中...</p></div>;
    if (error) return <div className={styles.container}><p className={styles.error}>エラーが発生しました: {error}</p></div>;
    if (!dashboardData) return <div className={styles.container}><p>データが見つかりません。</p></div>;

    // --- 表示部分 (JSX) ---
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>{dashboardData.event_name} ダッシュボード</h1>
            </header>

            <div className={styles.grid}>
                {/* サマリーカード */}
                <div className={`${styles.card} ${styles.summaryCard}`}>
                    <h2 className={styles.sectionTitle}>サマリー</h2>
                    <div className={styles.summaryGrid}>
                        <div><strong>総売上:</strong><p>{formatCurrency(dashboardData.total_sales)}</p></div>
                        <div><strong>決済回数:</strong><p>{dashboardData.total_transactions.toLocaleString()} 回</p></div>
                        <div><strong>平均注文額:</strong><p>{formatCurrency(dashboardData.average_order_value)}</p></div>
                    </div>
                </div>

                {/* 人気店舗カード */}
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>人気店舗 Top 5</h2>
                    <ol className={styles.storeList}>
                        {/* ▼▼▼ ここを修正 ▼▼▼ */}
                        {/* 1. `dashboardData.popular_stores` が存在するか (nullでないか) をチェック
                        2. 存在する場合にのみ、`.length` をチェックして要素が1つ以上あるかを確認
                        */}
                        {dashboardData.popular_stores && dashboardData.popular_stores.length > 0 ? (
                            // チェックを通過した場合、安全に .map() を使える
                            dashboardData.popular_stores.map((store, index) => (
                                <li key={index}>
                                    <span>{index + 1}. {store.name}</span>
                                    <span>{formatCurrency(store.sales)}</span>
                                </li>
                            ))
                        ) : (
                            // popular_storesがnullか、空の配列だった場合に表示
                            <p>店舗データがありません。</p>
                        )}
                    </ol>
                </div>

                {/* 紹介文カード */}
                <div className={`${styles.card} ${styles.fullWidth}`}>
                    <h2 className={styles.sectionTitle}>紹介文</h2>
                    <p className={styles.description}>{dashboardData.event_description || '紹介文が設定されていません。'}</p>
                </div>

                {/* 地図カード */}
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>会場地図</h2>
                    <div className={styles.mapImageContainer}>
                        {mapImageUrl ? (
                            <Image src={mapImageUrl} alt="会場地図" layout="fill" objectFit="contain" priority />
                        ) : (
                            <div className={styles.noImage}>地図画像はありません。</div>
                        )}
                    </div>
                    {/* ▼▼▼ 修正: 地図アップロード機能を有効化 ▼▼▼ */}
                    <div className={styles.uploadSection}>
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleMapUpload}
                            disabled={uploading}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className={styles.uploadButton}
                        >
                            {uploading ? 'アップロード中...' : (mapImageUrl ? '新しい地図をアップロード' : '地図をアップロード')}
                        </button>
                        {uploadError && <p className={styles.error}>{uploadError}</p>}
                    </div>
                </div>

                {/* ▼▼▼ 修正: 共有URLセクションをカードとしてグリッド内に配置 ▼▼▼ */}
                <div className={`${styles.card} ${styles.fullWidth}`}>
                    <h2 className={styles.sectionTitle}>管理・共有リンク</h2>
                    <div className={styles.shareUrlGrid}>
                        {/* 一般公開用マップページ */}
                        <div className={styles.shareUrlItem}>
                            <label>一般公開用マップページ:</label>
                            <Link href={mapUrl} className={styles.link} target="_blank" rel="noopener noreferrer">{mapUrl}</Link>
                        </div>
                        {/* Store作成ページURL */}
                        <div className={styles.shareUrlItem}>
                            <label htmlFor="store-create-url">Store作成ページURL:</label>
                            <div className={styles.shareUrlInputWrapper}>
                                <input id="store-create-url" type="text" value={storeCreateUrl} readOnly className={styles.shareUrlInput} />
                                <button onClick={() => handleCopyUrl('create', storeCreateUrl)} className={styles.shareUrlButton} disabled={copiedKey === 'create'}>
                                    {copiedKey === 'create' ? 'コピー完了' : 'コピー'}
                                </button>
                            </div>
                        </div>
                        {/* ストア一覧ページURL */}
                        <div className={styles.shareUrlItem}>
                            <label htmlFor="store-dashboard-url">ストア一覧ページURL:</label>
                            <div className={styles.shareUrlInputWrapper}>
                                <input id="store-dashboard-url" type="text" value={storeDashboardUrl} readOnly className={styles.shareUrlInput} />
                                <button onClick={() => handleCopyUrl('dashboard', storeDashboardUrl)} className={styles.shareUrlButton} disabled={copiedKey === 'dashboard'}>
                                    {copiedKey === 'dashboard' ? 'コピー完了' : 'コピー'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}