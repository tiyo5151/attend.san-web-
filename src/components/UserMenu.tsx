'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { LogOut } from 'lucide-react';
import { User } from 'next-auth';
import Link from 'next/link';

export const UserMenu = ({ user, className }: { user?: User; className?: string }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className={cn('items-center gap-x-4', className)}>
          <Avatar className='size-12 select-none'>
            <AvatarImage src={user?.image || ''} />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-col items-start justify-center'>
            <h2 className='text-xl font-bold'>{user?.name}</h2>
            <p className='text-sm text-muted-foreground'>{user?.email}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='relative top-1 w-56'>
        <DropdownMenuItem asChild>
          <Link href='/api/auth/signout'>
            <LogOut className='mr-2 size-4' />
            ログアウト
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
