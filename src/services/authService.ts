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

    return res;
  } catch (error) {
    if ((error as any).name === 'InvalidEmailPasswordError') {
      return {
        message: (error as any).type,
        code: 1,
      };
    } else if ((error as any).name === 'InvalidActiveAccountError') {
      return {
        message: (error as any).type,
        code: 2,
      };
    } else {
      return {
        message: (error as any).type,
        code: 0,
      };
    }
  }
}
