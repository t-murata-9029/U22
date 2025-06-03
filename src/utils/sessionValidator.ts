'use client'

/**TODO
 * DBと接続して検証するようにする
 */

import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

/* sessionを検証するファイル */

export async function sessionValidator() {
    const data = await supabase.auth.getSession()

    /* sessionが存在するか確認する */
    if (data.data.session?.access_token == null) {
        redirect('/user/login');
    }

    /* sessionが有効期限内か確認する */
    // 現在のUNIXタイムスタンプ（ミリ秒単位）を取得
    const current_timestamp_ms = Date.now();
    // 現在のUNIXタイムスタンプを秒単位に変換
    const current_timestamp_seconds = Math.floor(current_timestamp_ms / 1000);
    if (data.data.session?.expires_at == null || data.data.session?.expires_at < current_timestamp_seconds) {
        redirect('/user/login');
    }
}