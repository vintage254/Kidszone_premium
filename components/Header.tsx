 import Link from "next/link";
import Image from "next/image";
import { auth, SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { sessionClaims } = auth();
  const isAdmin = sessionClaims?.metadata?.role === 'ADMIN';

  return (
    <header className="flex justify-between items-center gap-5 border-b border-gray-200/20 pb-4">
      <Link href="/">
        <Image src="/icons/logo.png" alt="logo" width={130} height={30} />
      </Link>

      <ul className="flex flex-row items-center gap-4">
        {isAdmin && (
          <li>
            <Link href="/admin">
              <Button variant="outline" size="sm">Admin</Button>
            </Link>
          </li>
        )}
        <li>
          <SignOutButton>
            <Button size="sm">Logout</Button>
          </SignOutButton>
        </li>
      </ul>
    </header>
  );
};

export default Header;
