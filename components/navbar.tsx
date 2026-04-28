'use client';

import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { ArrowLeft, ArrowRight, Edit, KanbanSquare } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Separator } from './ui/separator';

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

// for boards page
interface NavbarProps {
  boardTitle?: string;
  boardColor?: string;
  onEditBoard?: () => void;
}

function Navbar({ boardTitle, boardColor, onEditBoard }: NavbarProps) {
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

  if (isBoardPage) {
    return (
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center  justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <Link
                href="/dashboard"
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 flex-shrink 0"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <p className="hidden sm:inline">Back to Dashboard</p>
                <p className="sm:hidden">Back</p>
              </Link>
              <Separator orientation="vertical" />
              <div
                className="flex items-center space-x-1 sm:space-x-2 min-w-0 cursor-pointer"
                onClick={onEditBoard}
              >
                <KanbanSquare className={`text-${boardColor}`} />
                <h2 className="text-lg font-bold text-gray-900 truncate">{boardTitle}</h2>
                {onEditBoard && (
                  <Button variant="ghost" size="sm" className="h-7 w-7 flex-shrink-0 p-0">
                    <Edit className="text-blue-500 " />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
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
