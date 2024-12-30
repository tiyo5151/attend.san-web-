import { signIn } from '../../auth';

const SignIn = () => {
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center'>
      <form
        className='rounded-xl p-3 ring-1 ring-slate-400'
        action={async () => {
          'use server';
          await signIn('google');
        }}
      >
        <button type='submit'>Signin with Google</button>
      </form>
    </div>
  );
};

export default SignIn;
