import { auth } from '@/auth';
import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

type TimeTable = {
  [periodNumber: number]: string[];
};

export const POST = async (req: NextRequest) =>
  handleAPIError(async () => {
    const { timeTableJsonText } = await req.json();

    const objectTimeTable = JSON.parse(timeTableJsonText) as TimeTable;

    Object.entries(objectTimeTable).map(([periodNumber, lectures]) => {
      lectures.map((lectureName: string, dayNumber: number) => {
        if (lectureName === '') return;

        registerLectureFacade(lectureName, Number(periodNumber), dayNumber);
      });
    });

    return NextResponse.json({ message: 'lecture registered' });
  });

const registerLectureFacade = async (
  lectureName: string,
  periodNumber: number,
  dayNumber: number,
) => {
  const isLectureExist = await checkLectureExist(lectureName);

  if (isLectureExist) {
    const lectureId = await getLectureId(lectureName);

    await registerLectureToTimeTable(lectureId!, periodNumber, dayNumber);
  } else {
    const NewLecture = await registerLecture(lectureName);

    await registerLectureToTimeTable(NewLecture.id, periodNumber, dayNumber);
  }
};

const checkLectureExist = async (lectureName: string) => {
  const lecture = await prisma.lecture.findFirst({
    where: {
      name: lectureName,
    },
  });

  const isExist = lecture !== null;

  return isExist;
};

const registerLecture = async (lectureName: string) => {
  const lecture = await prisma.lecture.create({
    data: {
      name: lectureName,
    },
  });

  return lecture;
};

const getLectureId = async (lectureName: string) => {
  const lecture = await prisma.lecture.findFirst({
    where: {
      name: lectureName,
    },
  });

  return lecture?.id;
};

const registerLectureToTimeTable = async (
  lectureId: string,
  periodNumber: number,
  dayNumber: number,
) => {
  const session = await auth();
  const userId = session?.user?.id;

  const timeTable = await prisma.timeTable.create({
    data: {
      userId: userId,
      lectureId: lectureId,
      periodNumber: periodNumber,
      dayNumber: dayNumber,
    },
  });
};
