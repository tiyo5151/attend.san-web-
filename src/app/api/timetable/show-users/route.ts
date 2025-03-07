import { auth } from '@/auth';
import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const GET = async () =>
  handleAPIError(async () => {
    const session = await auth();
    const userId = session?.user?.id;

    const timeTable = await prisma.timeTable.findMany({
      where: { userId: userId },
      include: { lecture: true },
    });

    const formattedTimeTable = formatTimeTable(timeTable);

    return NextResponse.json(
      { message: 'get timetable success', data: formattedTimeTable },
      { status: 200 },
    );
  });

//formatTimeTable関数の説明
//dbから取得したtimeTableを以下のような２次元配列にする
// [
// 1限目の授業の情報 [ {月曜日} , {火曜日} , {水曜日} , {木曜日} , {金曜日} , {土曜日} ],
// 2限目の授業の情報 ... ,
// 3限目の授業の情報 ... ,
// 4限目の授業の情報 ... ,
// 5限目の授業の情報 ... ,
// 6限目の授業の情報 ...
// ]

const formatTimeTable = (timeTable: any[]) => {
  const onePeriod = 1;
  const sixPeriod = 6;

  const formattedTimeTable: object[][] = [];

  for (let period = onePeriod; period <= sixPeriod; period++) {
    //一つの時限の月曜日から土曜日の授業情報を格納する配列
    const lecturesAtPeriod: object[] = [{}, {}, {}, {}, {}, {}];

    for (const lectureData of timeTable) {
      if (lectureData.periodNumber === period) {
        lecturesAtPeriod[lectureData.dayNumber] = lectureData.lecture;
      }
    }

    formattedTimeTable.push(lecturesAtPeriod);
  }

  return formattedTimeTable;
};
