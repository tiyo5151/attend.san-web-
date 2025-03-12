import { auth } from '@/auth';
import { handleAPIError } from '@/lib/handleAPIError';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) =>
  handleAPIError(async () => {
    const session = await auth();
    const userId = session?.user?.id;


    
    return NextResponse.json({ message: 'success', data: null }, { status: 200 });
  });
