'use client';
import { Button } from '@/components/ui/button';
import { signIn, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

export const Protected = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (status === 'unauthenticated') {
    return (
      <div className='flex flex-1 flex-col items-center justify-center gap-3'>
        <h1 className='text-2xl font-bold'>ログインが必要です</h1>
        <p className='text-sm text-muted-foreground'>
          このページを閲覧するには
          <span
            role='button'
            className='px-1 underline'
            onClick={() => signIn('google', { redirectTo: pathname })}
          >
            ログイン
          </span>
          または
          <span
            role='button'
            className='px-1 underline'
            onClick={() => router.push(`/sign-up?redirect=${encodeURIComponent(pathname)}`)}
          >
            新規登録
          </span>
          が必要です。
        </p>
        <div className='flex gap-2'>
          <Button onClick={() => signIn('google', { redirectTo: pathname })}>ログイン</Button>
          <Button
            variant='outline'
            onClick={() => router.push(`/sign-up?redirect=${encodeURIComponent(pathname)}`)}
          >
            新規登録
          </Button>
        </div>
      </div>
    );
  }

  return children;
};
