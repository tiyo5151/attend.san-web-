import HomeScreen from '@/components/page';
import SignIn from '@/components/SignIn';
import { auth } from '../../auth';

const Home = async () => {
  'use server';
  const session = await auth();
  if (!session?.user?.image) return <SignIn />;
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center'>
      <HomeScreen />
    </div>
  );
};

export default Home;
