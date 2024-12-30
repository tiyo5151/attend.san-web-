import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const POST = async (req: Request, res: NextResponse) =>
  handleAPIError(async () => {
    const userId = req.url.split('attendance/')[1];
    // const { semester } = await req.json();
    //semesterカラムは使うかわからないので仮で1を入れている
    const semester = '1';

    const newAttendance = await prisma.attendance.create({
      data: {
        semester,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        user: true,
      },
    });
    return NextResponse.json(
      { message: 'Attendance created', date: newAttendance },
      { status: 201 },
    );
  });
