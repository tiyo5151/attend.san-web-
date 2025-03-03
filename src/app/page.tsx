import HomeScreen from '@/components/page';
import { Protected } from '@/components/Protected';

const Home = async () => {
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center'>
      <Protected>
        <HomeScreen />
      </Protected>
    </div>
  );
};

export default Home;
