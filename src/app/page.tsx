import { auth } from '@/auth';
import HomeScreen from '@/components/page';
import { Protected } from '@/components/Protected';

const Home = async () => {
  const session = await auth();

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center'>
      <Protected>
        <HomeScreen user={session?.user} />
      </Protected>
    </div>
  );
};

export default Home;
