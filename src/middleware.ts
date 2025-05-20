// src/middleware.ts

import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // 1. Supabaseのセッション更新
  const response = await updateSession(request);

  // 2. リクエストURLをカスタムヘッダー x-url に追加
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);

  // 3. セッション更新後のレスポンスにヘッダーを上書きして返す
  response.headers.set('x-url', request.url);

  return response;
}

// 適用パス設定（静的ファイル・画像・faviconは除外）
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

