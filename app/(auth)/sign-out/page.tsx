import { signOutAction } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';

const SignOutPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold mb-4">Are you sure you want to sign out?</h1>
      <form action={signOutAction}>
        <Button type="submit" variant="destructive">Confirm Sign Out</Button>
      </form>
    </div>
  );
};

export default SignOutPage;
