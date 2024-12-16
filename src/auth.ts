import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { sendRequest } from './utils/api';
import { User } from './types/auth';

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
        console.log('>>>> res authorize', res)
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
              access_token: res.data?.access_token,
            };
          }
        } else {
          throw new Error('Invalid credentials.');
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = user as User;
      }
      return token;
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
