'use server';

import { auth, signIn } from '@/auth';

type FormDataLogin = {
  email: string;
  password: string;
};

export async function authenticate(formData: FormDataLogin) {
  try {
    const res = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });
    console.log('res', res)
    return res;
  } catch (error) {
    if ((error as any).name === 'InvalidEmailPasswordError') {
      return {
        error: (error as any).type,
        code: 1,
      };
    } else if ((error as any).name === 'InvalidActiveAccountError') {
      return {
        error: (error as any).type,
        code: 2,
      };
    } else {
      return {
        error: 'Internal Server Error',
        code: 0,
      };
    }
  }
}

export async function fetchSession() {
  const session = await auth();
  return session?.user;
}
