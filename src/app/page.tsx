import { getServerSession } from 'next-auth';
import { authOptions } from '@/feature/auth';
import SignOut from '@/feature/auth/components/SignOut';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  return (
    <main>
      <h2>{`Welcome to Taskflow ${session?.user.username}`}</h2>
      <SignOut />
    </main>
  );
}
