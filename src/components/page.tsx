import SignOut from '@/components/SignOut';
function HomeScreen() {
  return (
    <div className='flex size-full flex-col items-center justify-start'>
      <SignOut />
      <div className='grid size-full grid-cols-8 grid-rows-7 gap-2'>
        <div className='col-span-2'>1</div>
        <div className='col-span-3 col-start-6'>2</div>
        <div className='col-span-2 col-start-4 row-span-4 row-start-3'>3</div>
        <div className='col-start-7 row-start-6'>4</div>
        <div className='col-span-2 col-start-1 row-span-4 row-start-3'>5</div>
        <div className='col-start-8 row-start-6'>6</div>
      </div>
    </div>
  );
}

export default HomeScreen;
