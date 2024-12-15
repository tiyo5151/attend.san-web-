import SignIn from '@/components/SignIn';
import SignOut from '@/components/SignOut';
import Image from 'next/image';
import { auth } from '../../auth';

const Home = async () => {
  const session = await auth();

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-y-10'>
      <div className='flex'>
        {!session?.user?.image ? (
          <SignIn />
        ) : (
          <div className='flex gap-4'>
            <SignOut />
            <Image
              src={session.user.image}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
              alt='image of user'
              width={60}
              height={20}
            ></Image>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
