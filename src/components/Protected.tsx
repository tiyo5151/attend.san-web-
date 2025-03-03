'use client';
import { Button } from '@/components/ui/button';
import { signIn, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export const Protected = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
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
          が必要です。
        </p>
        <div className='flex gap-2'>
          <Button onClick={() => signIn('google', { redirectTo: pathname })}>ログイン</Button>
        </div>
      </div>
    );
  }

  return children;
};
