import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: 'user' | 'admin' | 'superadmin';
    };
  }

  interface JWT {
    accessToken?: string;
    role?: string;
  }
}