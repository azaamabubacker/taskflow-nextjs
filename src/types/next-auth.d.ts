import { DefaultSession } from 'next-auth';

// 1. This updates the User and Session
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    username: string;
  }
}

// 2. This updates the Token (Notice the different module name!)
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
  }
}
