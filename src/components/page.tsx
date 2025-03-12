import { auth } from '@/auth';
import ImportTimeTableButton from '@/components/ImportTimeTableButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserMenu } from '@/components/UserMenu';

const HomeScreen = async () => {
  const progress = 50;
  const session = await auth();

  const sampleTimeTable = [
    {
      period: '1',
      subject: '',
    },
    {
      period: '2',
      subject: '情報連携学概論II',
    },
    {
      period: '3',
      subject: '情報連携基礎実習II/情報連携実習IB3',
    },
    {
      period: '4',
      subject: '',
    },
    {
      period: '5',
      subject: '',
    },
    {
      period: '6',
      subject: 'マクロ経済学日本語',
    },
  ];

  return (
    <div className='container mx-auto grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3'>
      <Card className='col-span-1 flex items-center p-1'>
        <UserMenu user={session?.user} className='size-full rounded-lg' />
      </Card>

      <Card className='col-start-3 p-4'>
        <h3 className='mb-2 grid-cols-3 text-lg font-semibold'>キャラクターEXP</h3>
        <Progress value={progress} className='w-full' />
        <p className='mt-2 text-right text-sm'>{progress}/100</p>
      </Card>

      <Table className='col-span-1 row-span-2 row-start-2'>
        <TableCaption>時間割</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>時限</TableHead>
            <TableHead className='flex items-center justify-between'>
              科目
              <ImportTimeTableButton />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleTimeTable.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.period}</TableCell>
              <TableCell>{item.subject}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Card className='col-span-1 flex min-h-[300px] items-center justify-center p-6 md:col-span-2 lg:col-span-2'>
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
