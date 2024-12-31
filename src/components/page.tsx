'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const HomeScreen = () => {
  const progress = 50;
  return (
    <div className='container mx-auto grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3'>
      <Card className='col-span-1 p-4'>
        <div className='flex items-center space-x-4'>
          <Avatar>
            <AvatarImage src='/placeholder.svg' />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <div>
            <h2 className='text-xl font-bold'>ユーザー名</h2>
            <p className='text-muted-foreground text-sm'>@username</p>
          </div>
        </div>
      </Card>

      <Card className='col-span-1 p-4'>
        <h3 className='mb-2 text-lg font-semibold'>キャラクターEXP</h3>
        <Progress value={progress} className='w-full' />
        <p className='mt-2 text-right text-sm'>{progress}/100</p>
      </Card>

      <Card className='col-span-1 flex min-h-[300px] items-center justify-center p-6 md:col-span-2 lg:col-span-3'>
        <div className='text-center'>
          <h2 className='mb-4 text-2xl font-bold'>キャラクター表示エリア</h2>
          <Avatar className='size-32'>
            <AvatarImage src='/placeholder.svg' />
            <AvatarFallback>CH</AvatarFallback>
          </Avatar>
        </div>
      </Card>
    </div>
  );
};

export default HomeScreen;
