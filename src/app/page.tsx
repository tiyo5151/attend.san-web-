import SignIn from '@/components/SignIn';
import SignOut from '@/components/SignOut';
import { auth } from '../../auth';

const Home = async () => {
  const session = await auth();
  if (!session?.user?.image) return <SignIn />;

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center'>
      <SignOut />
    </div>
  );
};

export default Home;
