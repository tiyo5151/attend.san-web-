import { dbConnect } from '@/lib/dbConnect';
import { handleAPIError } from '@/lib/handleAPIError';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '../../../../auth';

export const GET = async (req: Request, res: NextResponse) =>
  handleAPIError(async () => {
    dbConnect();

    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;
    // const userId = 'cm0m8xwnu0000a9a6whye26a0';

    const todos = await prisma.todo.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        title: true,
        completed: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ message: 'success', data: todos });
  });

export const POST = async (req: Request, res: NextResponse) =>
  handleAPIError(async () => {
    dbConnect();
    console.log('success');

    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { title } = await req.json();

    const todo = await prisma.todo.create({
      data: {
        title,
        user: {
          connect: { id: userId },
        },
        completed: false,
      },
    });
    return NextResponse.json({ message: 'success', data: todo }, { status: 201 });
  });
