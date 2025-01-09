import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { sendRequest } from './utils/api';
import { User } from './types/auth';
import {
  CustomAuthError,
  InvalidActiveAccountError,
  InvalidEmailPasswordError,
} from './utils/error';
import { refreshAccessToken } from '@/services/authService';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const res = await sendRequest<IBackendRes<ILogin>>({
          method: 'POST',
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/auths/login`,
          body: {
            email: credentials.email,
            password: credentials.password,
          },
        });

        if (res.statusCode === 201) {
          const user = res.data?.user;

          if (user) {
            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
              phone: user.phone,
              address: user.address,
              groupName: user.groupName,
              roles: user.roles,
              access_token: res.data?.access_token,
              // refresh_token: res.data?.refresh_token,
              // access_expire: Date.now() + 60 * 1000,
            };
          }
        } else if (+res.statusCode === 401 || +res.statusCode === 404) {
          throw new InvalidEmailPasswordError();
        } else if (+res.statusCode === 400) {
          throw new InvalidActiveAccountError();
        } else {
          throw new CustomAuthError('Lỗi đăng nhập. Vui lòng thử lại sau...');
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as User;
        return token;
      }
      // console.log('user', user);
      // console.log('token', token);
      // console.log('token.user', token.user);
      // const now = Date.now();
      // if (now < token.user.access_expire) {
      //   return token;
      // }
      return token;

      // try {
      //   const refreshedToken = await refreshAccessToken(
      //     token.user.refresh_token,
      //   );

      //   if (refreshedToken) {
      //     return {
      //       ...token,
      //       user: {
      //         ...token.user,
      //         access_token: refreshedToken.data.access_token,
      //         access_expire: Date.now() + 60 * 1000, // Update thời hạn
      //       },
      //     };
      //   }
      // } catch (error) {
      //   console.error('Failed to refresh access token:', error);
      //   throw new Error('Your session has expired. Please log in again.');
      // }
    },
    session({ session, token }) {
      (session.user as User) = token.user;

      return session;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 3600,
  },
});
