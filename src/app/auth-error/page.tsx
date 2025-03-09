'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || '認証エラーが発生しました';
  const returnUrl = searchParams.get('returnUrl') || '/';

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>認証エラー</h2>
          <p className='mt-2 text-center text-sm text-gray-600'>{error}</p>
        </div>
        <div className='mt-8 space-y-6'>
          <div className='flex items-center justify-center'>
            <Link
              href='/api/auth/signin'
              className='relative flex w-1/2 justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
            >
              ログインページへ戻る
            </Link>
          </div>
          <div className='flex items-center justify-center'>
            <Link href={returnUrl} className='text-sm text-blue-600 hover:text-blue-500'>
              元のページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
