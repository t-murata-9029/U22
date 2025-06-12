'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './EventDashboard.module.css';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid'; // 追加: 一意なファイル名生成用

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
// 金額を日本円形式にフォーマットする
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
};

// --- UIコンポーネント ---
// 親コンポーネントから event_id をpropsとして受け取る
export default function EventDashboard({ event_id }: { event_id: string }) {
    // --- State管理 ---
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [mapImageUrl, setMapImageUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- データ取得ロジック ---
    // 1. RPC関数を呼び出して基本データを取得するEffect
    useEffect(() => {
        if (!event_id) return;

        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data, error: rpcError } = await supabase.rpc('get_dashboard_data', {
                    p_event_id: event_id,
                });

                if (rpcError) throw new Error(rpcError.message || 'データベース関数の呼び出しに失敗しました。');

                if (data) {
                    setDashboardData(data);
                } else {
                    throw new Error("イベントデータが見つかりませんでした。");
                }

            } catch (err: any) {
                setError(err.message);
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                // 基本データの取得が終わったら一旦ローディングを解除
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [event_id]);

    // 2. 取得したファイル名から画像の公開URLを生成するEffect
    useEffect(() => {
        // dashboardDataが存在し、かつ画像ファイル名がある場合のみ実行
        if (dashboardData?.map_image_filename) {
            const { data } = supabase
                .storage
                .from('image-bucket')
                .getPublicUrl(dashboardData.map_image_filename);

            setMapImageUrl(data.publicUrl);
        }
    }, [dashboardData]); // dashboardDataが更新されたら実行

    // 地図画像アップロード処理
    const handleMapUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setUploadError(null);

        try {
            // 一意なファイル名を生成
            const fileExt = file.name.split('.').pop();
            const fileName = `${uuidv4()}.${fileExt}`;

            // Supabase Storageへアップロード
            const { error: uploadError } = await supabase.storage
                .from('image-bucket')
                .upload(fileName, file, { upsert: false });

            if (uploadError) throw uploadError;

            // mapテーブルへレコード追加
            const { error: insertError } = await supabase
                .from('map')
                .insert([
                    {
                        event_id,
                        image: fileName,
                        name: file.name,
                    },
                ]);

            if (insertError) throw insertError;

            // 成功時はダッシュボードデータを再取得
            window.location.reload();
        } catch (err: any) {
            setUploadError(err.message || 'アップロードに失敗しました');
        } finally {
            setUploading(false);
        }
    };

    // --- レンダリング前の状態管理 ---
    if (loading) {
        return <div className={styles.container}><p>ダッシュボードデータを読み込み中...</p></div>;
    }
    if (error) {
        return <div className={styles.container}><p className={styles.error}>エラーが発生しました: {error}</p></div>;
    }
    if (!dashboardData) {
        return <div className={styles.container}><p>データが見つかりません。</p></div>;
    }

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
                        <div>
                            <strong>総売上:</strong>
                            <p>{formatCurrency(dashboardData.total_sales)}</p>
                        </div>
                        <div>
                            <strong>決済回数:</strong>
                            <p>{dashboardData.total_transactions.toLocaleString()} 回</p>
                        </div>
                        <div>
                            <strong>平均注文額:</strong>
                            <p>{formatCurrency(dashboardData.average_order_value)}</p>
                        </div>
                    </div>
                </div>

                {/* 人気店舗カード */}
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>人気店舗 Top 5</h2>
                    <ol className={styles.storeList}>
                        {dashboardData.popular_stores && dashboardData.popular_stores.length > 0 ? (
                            dashboardData.popular_stores.map((store, index) => (
                                <li key={index}>
                                    <span>{index + 1}. {store.name}</span>
                                    <span>{formatCurrency(store.sales)}</span>
                                </li>
                            ))
                        ) : (
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
                    {/* アップロードボタンをボタンらしく修正 */}
                    <div style={{ marginTop: 16 }}>
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
                            className={styles.uploadButton} // 必要ならCSSで装飾
                        >
                            {uploading ? 'アップロード中...' : '地図画像をアップロード'}
                        </button>
                        {uploadError && <p className={styles.error}>{uploadError}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}