import { auth } from '@/auth';
import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) =>
  handleAPIError(async () => {
    //day : 曜日(文字列 ex. '月曜日')
    const { day } = await req.json();

    const session = await auth();
    const userId = session?.user?.id;

    const timeTable = await prisma.timeTable.findMany({
      where: {
        userId: userId,
        day: {
          day: day,
        },
      },
      include: {
        lecture: true,
        day: true,
      },
      orderBy: {
        periodNumber: 'asc',
      },
    });

    return NextResponse.json({ message: 'success', data: timeTable }, { status: 200 });
  });
