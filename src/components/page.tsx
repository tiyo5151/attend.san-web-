'use client';

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
import { User } from 'next-auth';
import { useEffect, useState } from 'react';
interface PeriodInfo {
  periodNumber: string;
  beginTime: string;
  endTime: string;
}
// 時限情報の配列
const periodInfos: PeriodInfo[] = [
  { periodNumber: '1', beginTime: '9:00', endTime: '10:30' },
  { periodNumber: '2', beginTime: '10:40', endTime: '12:10' },
  { periodNumber: '3', beginTime: '13:00', endTime: '14:30' },
  { periodNumber: '4', beginTime: '14:45', endTime: '16:15' },
  { periodNumber: '5', beginTime: '16:30', endTime: '18:00' },
  { periodNumber: '6', beginTime: '18:15', endTime: '19:45' },
];

const getDayOfWeek = () => {
  const daysOfWeek = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
  const today = new Date().getDay();
  // 日曜日の場合は平日のデータがないので月曜日（1）を返す
  // JavaScriptでは日曜日は0だが、データベースでは1が月曜日
  const dayNumber = today;
  return {
    name: daysOfWeek[today],
    number: dayNumber,
  };
};

const HomeScreen = ({ user }: { user: User | undefined }) => {
  const progress = 50;
  const [todayTimetable, setTodayTimetable] = useState<
    {
      period: string;
      subject: string;
      beginTime?: string;
      endTime?: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sampleTimeTable = periodInfos.map((info) => ({
    period: info.periodNumber,
    subject: (() => {
      switch (info.periodNumber) {
        case '2':
          return '情報連携学概論II';
        case '3':
          return '情報連携基礎実習II/情報連携実習IB3';
        case '6':
          return 'マクロ経済学日本語';
        default:
          return '';
      }
    })(),
    beginTime: info.beginTime,
    endTime: info.endTime,
  }));

  useEffect(() => {
    const FetchTimeTable = async () => {
      try {
        const today = getDayOfWeek();
        console.log('今日の曜日:', today.name, '(番号:', today.number, ')');
        console.log('path:', `/api/timetable/get/${today.name}`);
        // 曜日名をパスパラメータとして送信
        const response = await fetch(`api/timetable/get/${today.name}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('APIレスポンスステータス:', response.status);
        const data = await response.json();
        console.log('APIレスポンスデータ:', data);

        if (data.data && Array.isArray(data.data)) {
          const formattedData = data.data.map((item: any) => {
            // DBから取得したperiodNumberに基づいて時間情報を取得
            const periodInfo = periodInfos.find(
              (p) => p.periodNumber === String(item.periodNumber),
            ) || {
              beginTime: '',
              endTime: '',
            };

            return {
              period: String(item.periodNumber) || '',
              subject: item.lecture?.name || '',
              beginTime: periodInfo.beginTime,
              endTime: periodInfo.endTime,
            };
          });
          console.log('フォーマット後のデータ:', formattedData);
          setTodayTimetable(formattedData);
        } else {
          console.log('データ形式が予期しないものです:', data);
          setTodayTimetable(sampleTimeTable);
        }
      } catch (error) {
        console.error('時間割の取得に失敗しました:', error);
        setTodayTimetable(sampleTimeTable);
      }
    };
    FetchTimeTable();
  }, [isLoading]);

  // 表示用のデータ（APIから取得したデータ、またはフォールバック）
  const displayTimeTable = todayTimetable.length > 0 ? todayTimetable : sampleTimeTable;

  return (
    <div className='container mx-auto grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3'>
      <Card className='col-span-1 flex items-center p-1'>
        <UserMenu user={user} className='size-full rounded-lg' />
      </Card>

      <Card className='col-start-3 p-4'>
        <h3 className='mb-2 grid-cols-3 text-lg font-semibold'>キャラクターEXP</h3>
        <Progress value={progress} className='w-full' />
        <p className='mt-2 text-right text-sm'>{progress}/100</p>
      </Card>

      <Table className='col-span-1 row-span-2 row-start-2'>
        <TableCaption>今日（{getDayOfWeek().name}）の時間割</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>時限</TableHead>
            <TableHead>科目</TableHead>
            <TableHead>
              {' '}
              <ImportTimeTableButton isLoading={isLoading} setIsLoading={setIsLoading} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayTimeTable.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.period}</TableCell>
              <TableCell>
                {item.beginTime && item.endTime
                  ? `${item.beginTime}～${item.endTime}`
                  : '時間未設定'}
              </TableCell>
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
