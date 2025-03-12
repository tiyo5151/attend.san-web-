import { auth } from '@/auth';
import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) =>
  handleAPIError(async () => {
    //nowTime : HH:mm形式の現在時刻
    //day : 曜日(文字列 ex. '月曜日')
    const { nowTime, day } = await req.json();

    const session = await auth();
    const userId = session?.user?.id;

    const { isSuccessAttendance, lectureId } = await checkAttendance(nowTime, day, userId);

    if (isSuccessAttendance) {
      recordAttendance(userId, lectureId);

      return NextResponse.json(
        { isSuccessAttendance: true, message: 'attendance success' },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { isSuccessAttendance: false, message: 'attendance failed' },
        { status: 400 },
      );
    }
  });

const checkAttendance = async (nowTime: string, day: string, userId: string) => {
  //曜日と出席ボタンを押したときの時間で該当する授業数を取得
  const lecture = await prisma.timeTable.findFirst({
    where: {
      userId: userId,
      period: {
        beginTime: {
          lte: nowTime,
        },
        endTime: {
          gte: nowTime,
        },
      },
      day: {
        day: day,
      },
    },
    include: {
      period: true,
      day: true,
      lecture: true,
    },
  });

  //時間と曜日が一致する授業が1つの時に、正常に出席していることになる。
  const isSuccessAttendance = lecture !== null;

  return { isSuccessAttendance: isSuccessAttendance, lectureId: lecture?.lectureId };
};

const recordAttendance = async (userId: string, lectureId: string) => {
  await prisma.attendance.create({
    data: {
      userId: userId,
      lectureId: lectureId,
    },
  });
};
