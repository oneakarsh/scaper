import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }

  interface JWT {
    accessToken?: string;
  }
}

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user?: {
      id?: string;
      name?: string;
      email?: string;
      role?: string;
    };
  }

  interface JWT {
    accessToken?: string;
    role?: string;
    id?: string;
    name?: string;
    email?: string;
  }
}