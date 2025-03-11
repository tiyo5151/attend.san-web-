import { auth } from '@/auth';
import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) =>
  handleAPIError(async () => {
    const { NowTime, day } = await req.json();

    const session = await auth();
    const userId = session?.user?.id;

    const numOfLecture = await prisma.timeTable.count({
      where: {
        userId: userId,
        period: {
          beginTime: {
            lte: time,
          },
          endTime: {
            gte: time,
          },
        },
        day: {
          day: day,
        },
      },
      include: {
        period: true,
        day: true,
      },
    });

    const isSuccessAttendance = numOfLecture === 1;

    return NextResponse.json({ message: 'success', data: isSuccessAttendance }, { status: 200 });
  });
