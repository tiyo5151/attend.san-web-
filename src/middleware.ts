import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from 'next/server';
import { auth } from './auth'; // auth.tsファイルから認証設定をインポート

export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

// ミドルウェアを連結する関数
export function chainMiddlewares(functions: MiddlewareFactory[] = [], index = 0): NextMiddleware {
  const current = functions[index];
  if (current) {
    const next = chainMiddlewares(functions, index + 1);
    return current(next);
  }
  return () => NextResponse.next();
}

// 【ミドルウェア1】IP制限（タイプミス修正）
function withIpRestriction(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    // ----------------------------------------------
    // ここから

    // ※事前にIPアドレスのホワイトリストを環境変数「IP_WHITELIST」に登録しておく必要あり（カンマ区切りで複数指定可）
    const IP_WHITELIST = process.env.IP_WHITELIST!.split(',');
    const res = NextResponse.next();

    // access-deniedページにはミドルウェアを適用しない
    if (request.nextUrl.pathname === '/access-denied') {
      return res;
    }

    // ipアドレスを取得
    let ip: string = request.headers.get('x-real-ip') ?? '';

    // プロキシ経由の場合
    const forwardedFor = request.headers.get('x-forwarded-for');

    // プロキシ経由の場合は、プロキシのIPアドレスを取得
    if (!ip && forwardedFor) {
      ip = forwardedFor.split(',').at(0) ?? 'Unknown';
    }

    // 取得したIPアドレスがホワイトリストに含まれているかチェックし、含まれていない場合はアクセス拒否
    if (!IP_WHITELIST.includes(ip)) {
      console.log(`IPアドレス${ip}はホワイトリストに含まれていません`);
      return NextResponse.redirect(new URL('/access-denied', request.url)); // アクセス拒否のページにリダイレクト
    }

    // ここまではIP制限以外の処理に変えてもOK！
    // ----------------------------------------------

    // 次のミドルウェアを実行
    return middleware(request, event);
  };
}

// 【ミドルウェア2】Auth.jsのミドルウェア（認証）- 最新バージョン対応
function withLogin(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    // 認証セッション情報を取得
    const session = await auth();

    // 認証が必要なページで未認証の場合はログインページにリダイレクト
    if (
      !session &&
      !request.nextUrl.pathname.startsWith('/api/auth') &&
      !request.nextUrl.pathname.startsWith('/access-denied') &&
      !request.nextUrl.pathname.startsWith('/login')
    ) {
      // ログインページへリダイレクト
      const loginUrl = new URL('/api/auth/signin', request.url);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // 認証済みの場合は次のミドルウェアを実行
    return middleware(request, event);
  };
}

// ミドルウェアを連結（タイプミス修正）
export default chainMiddlewares([withIpRestriction, withLogin]);
