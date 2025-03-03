import NextAuth, { AuthOptions } from 'next-auth';

// 認証プロバイダーのインポート
// 例: import GithubProvider from "next-auth/providers/github";
// 例: import CredentialsProvider from "next-auth/providers/credentials";

// Auth.js設定
export const authOptions: AuthOptions = {
  providers: [
    // 実際に使用するプロバイダーを設定
    // 例: GithubProvider({ clientId: process.env.GITHUB_ID!, clientSecret: process.env.GITHUB_SECRET! }),
    // 例: CredentialsProvider({...})
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    // 必要に応じて他のカスタムページも設定
  },
  callbacks: {
    // 必要なコールバック関数を定義
    // session, jwt, redirect等
  },
};

// Auth.jsハンドラーと認証関数
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
