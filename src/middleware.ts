// middleware.ts
// 修正前：次のコードで問題があります
// import { withAuth } from 'next-auth/middleware';

// 修正後：Auth.js v5 以降では以下のようにインポートします
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const session = await auth();

  // セッションがなければログインページにリダイレクト
  if (!session) {
    const signInUrl = new URL('/api/auth/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // 保護したいパスを指定
    '/dashboard/:path*',
    '/api/protected/:path*',
    // 必要なパスを追加
  ],
};
