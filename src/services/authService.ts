'use server';

import { signIn } from '@/auth';
import { sendRequest } from '@/utils/api';
import {
  CustomAuthError,
  InvalidActiveAccountError,
  InvalidEmailPasswordError,
} from '@/utils/error';

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
    if (error instanceof InvalidEmailPasswordError) {
      return { message: InvalidEmailPasswordError.type, code: 1 };
    } else if (error instanceof InvalidActiveAccountError) {
      return { message: InvalidActiveAccountError.type, code: 2 };
    } else if (error instanceof CustomAuthError) {
      return { message: error.type, code: 0 };
    } else {
      return { message: 'Lỗi không xác định', code: -1 };
    }
  }
}

export async function refreshAccessToken(token: any) {
  const refreshToken = token.user.refresh_token;
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/auths/refresh`,
    method: 'POST',
    body: { refreshToken },
  });

  return res;
}
