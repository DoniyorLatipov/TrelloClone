'use client';

import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { ArrowRight, KanbanSquare } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function BasicNavbarLayout({ children }: React.PropsWithChildren) {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <KanbanSquare className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Trello Clone</h1>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">{children}</div>
      </div>
    </header>
  );
}

function Navbar() {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();

  const isDashboardPage = pathname === '/dashboard';
  const isBoardPage = pathname.startsWith('/boards/');

  if (isDashboardPage) {
    return (
      <BasicNavbarLayout>
        <UserButton />
      </BasicNavbarLayout>
    );
  }

  return (
    <BasicNavbarLayout>
      {isSignedIn ? (
        <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
          <span className="text-xs hidden sm:block text-gray-600">
            Welcome, {user?.firstName ?? user.emailAddresses[0].emailAddress}
          </span>
          <Link href="/dashboard">
            <Button size="sm" className="text-sm sm:text-sm">
              Open your Dashboard <ArrowRight />
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <SignInButton>
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button size="sm" className="text-xs sm:text-sm">
              Sign Up
            </Button>
          </SignUpButton>
        </>
      )}
    </BasicNavbarLayout>
  );
}

export default Navbar;
