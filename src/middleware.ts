// import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from 'next/server';
// import { auth } from './auth'; // auth.tsファイルから認証設定をインポート

// export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

// // ミドルウェアを連結する関数
// export function chainMiddlewares(functions: MiddlewareFactory[] = [], index = 0): NextMiddleware {
//   const current = functions[index];
//   if (current) {
//     const next = chainMiddlewares(functions, index + 1);
//     return current(next);
//   }
//   return () => NextResponse.next();
// }

// // 【ミドルウェア1】IP制限（タイプミス修正）
// function withIpRestriction(middleware: NextMiddleware) {
//   return async (request: NextRequest, event: NextFetchEvent) => {
//     // IPホワイトリストが未設定の場合は空の配列をデフォルト値として使用
//     const ipWhitelist = process.env.IP_WHITELIST?.split(',') || [];
//     const res = NextResponse.next();

//     // access-deniedページにはミドルウェアを適用しない
//     if (request.nextUrl.pathname === '/access-denied') {
//       return res;
//     }

//     // IPホワイトリストが空の場合は制限をスキップ
//     if (ipWhitelist.length === 0) {
//       console.log('IPホワイトリストが設定されていません、制限をスキップします');
//       return middleware(request, event);
//     }

//     // 残りのコードは同じ
//     let ip: string = request.headers.get('x-real-ip') ?? '';

//     const forwardedFor = request.headers.get('x-forwarded-for');
//     if (!ip && forwardedFor) {
//       ip = forwardedFor.split(',').at(0) ?? 'Unknown';
//     }

//     if (!ipWhitelist.includes(ip)) {
//       console.log(`IPアドレス${ip}はホワイトリストに含まれていません`);
//       return NextResponse.redirect(new URL('/access-denied', request.url));
//     }

//     return middleware(request, event);
//   };
// }

// // 【ミドルウェア2】Auth.jsのミドルウェア（認証）- 最新バージョン対応
// function withLogin(middleware: NextMiddleware) {
//   return async (request: NextRequest, event: NextFetchEvent) => {
//     try {
//       // 認証セッション情報を取得
//       const session = await auth();

//       // 認証エラーページへのアクセスは常に許可
//       if (request.nextUrl.pathname.startsWith('/auth-error')) {
//         return middleware(request, event);
//       }

//       // 認証が必要なページで未認証の場合はログインページにリダイレクト
//       if (
//         !session &&
//         !request.nextUrl.pathname.startsWith('/api/auth') &&
//         !request.nextUrl.pathname.startsWith('/access-denied') &&
//         !request.nextUrl.pathname.startsWith('/login')
//       ) {
//         // ログインページへリダイレクト
//         const loginUrl = new URL('/api/auth/signin', request.url);
//         loginUrl.searchParams.set('callbackUrl', request.url);
//         return NextResponse.redirect(loginUrl);
//       }

//       // 認証済みの場合は次のミドルウェアを実行
//       return middleware(request, event);
//     } catch (error) {
//       // エラーログを出力
//       console.error('認証処理中にエラーが発生しました:', error);

//       // エラーの種類に応じた処理
//       if (error instanceof Error) {
//         // エラーメッセージをURLパラメータとして渡す
//         const errorUrl = new URL('/auth-error', request.url);
//         errorUrl.searchParams.set('error', error.message);
//         errorUrl.searchParams.set('returnUrl', request.url);
//         return NextResponse.redirect(errorUrl);
//       }

//       // 不明なエラーの場合は一般的なエラーページへリダイレクト
//       return NextResponse.redirect(new URL('/auth-error?error=unknown', request.url));
//     }
//   };
// }

// // ミドルウェアを連結（タイプミス修正）
// export default chainMiddlewares([withIpRestriction, withLogin]);

export { auth as middleware } from '@/auth';

// どのパスにミドルウェアを適用するかを指定
export const config = {
  matcher: [
    // 認証APIパス、ログインページ、静的ファイル、画像などは除外
    '/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)',
  ],
};
