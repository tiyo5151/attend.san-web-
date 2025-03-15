import { auth } from '@/auth';
import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) =>
  handleAPIError(async () => {
    const session = await auth();
    const userId = session?.user?.id;

    const numOfAttendance = await prisma.attendance.groupBy({
      by: ['lectureId'],
      where: {
        userId: userId,
      },
      _count: {
        _all: true,
      },
    });

    //上のgroupByで取得したデータをlectureIdごとにlectureNameを取得して整形
    const formattedResult = await Promise.all(
      numOfAttendance.map(async (item) => {
        const lectureInfo = await prisma.lecture.findUnique({
          where: {
            id: item.lectureId,
          },
          select: { name: true },
        });

        return {
          lectureId: item.lectureId,
          lectureName: lectureInfo?.name,
          numOfAttendance: item._count._all,
        };
      }),
    );

    return NextResponse.json({ message: 'success', data: formattedResult }, { status: 200 });
  });
