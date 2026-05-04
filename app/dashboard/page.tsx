'use client';
import Navbar from '@/components/navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getColorClass } from '@/lib/getColorClass';
import { useBoards } from '@/lib/hooks/useBoards';
import { useUser } from '@clerk/nextjs';
import {
  CalendarClock,
  Filter,
  FolderOpen,
  Grid3x3,
  KanbanSquare,
  List,
  Loader2,
  Plus,
  Rocket,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type ViewModeType = 'grid' | 'list';

export default function DashboardPage() {
  const { user } = useUser();
  const { createBoard, loading, error, boards } = useBoards();
  const [viewMode, setViewMode] = useState<ViewModeType>('grid');

  const handleCreateBoard = async () => {
    await createBoard({ title: 'New Board' });
  };

  const renderContent = () => {
    if (boards.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-center">
          <FolderOpen className="w-12 h-12 text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No boards yet</h3>
          <p className="text-sm text-gray-600 mb-6">
            Get started by creating your first project board.
          </p>
          <Button onClick={handleCreateBoard}>
            <Plus className="w-4 h-4 mr-2" />
            Create Board
          </Button>
        </div>
      );
    }

    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {boards.map((board) => (
            <Link href={`/boards/${board.id}`} key={board.id}>
              <Card className="hover:shadow-lg transition-shadow coursor-pointer group gap-0">
                <CardHeader className="pb-3">
                  <div className="flex items-cente justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 ${getColorClass(board.color, 'bg')} rounded`} />
                      <CardTitle className="text-base sm:text-lg group-hover:text-blue-600 transition-color">
                        {board.title}
                      </CardTitle>
                    </div>
                    <Badge className="text-xs" variant="secondary">
                      New
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription className="text-sm mb-4">{board.description}</CardDescription>
                  <div className="flex flex-col sm:flex-row sm:items-cener sm:justify-between text-gray-500 space-y-1 sm:space-y-0">
                    <span>Created {new Date(board.created_at).toLocaleDateString()}</span>
                    <span>Updated {new Date(board.updated_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          <Card className="border-2 border-dashed border-gray-200 bg-gray-50 hover:border-blue-400 transition-colors cursor-pointer group">
            <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
              <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
              <p className="text-sm sm:text-base text-gray-600 group-hover:text-blue-600 font-medium">
                Create new board
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (viewMode === 'list') {
      return (
        <div className="grid grid-cols-1">
          {boards.map((board, index) => (
            <Link href={`/boards/${board.id}`} key={board.id}>
              {/* hower-shadow-[15px... used to make shadow only for x axis */}
              <Card
                className={`hover:shadow-2xl hover:shadow-[15px_0_20px_-10px_rgba(59,130,246,0.5),-15px_0_20px_-10px_rgba(59,130,246,0.5)] hover:shadow-blue-300 transition-shadow coursor-pointer group rounded-none gap-0 ${index === 0 ? 'rounded-t-sm' : ''} ${index === boards.length - 1 ? 'rounded-b-sm' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 bg-${board.color} rounded`} />
                      <CardTitle className="text-base sm:text-lg group-hover:text-blue-600 transition-color whitespace-nowrap">
                        {board.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm ml-2 self-end order-2 mb-2 sm:mb-0">
                      {board.description}
                    </CardDescription>
                    <Badge className="text-xs order-1 sm:order-2" variant="secondary">
                      New
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-cener sm:justify-between text-gray-500 space-y-1 sm:space-y-0">
                    <span>Created {new Date(board.created_at).toLocaleDateString()}</span>
                    <span>Updated {new Date(board.updated_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          <Card className="border-2 border-dashed border-gray-200 bg-gray-50 hover:border-blue-400 transition-colors cursor-pointer group p-1 mt-5 rounded-sm">
            <CardContent className="flex flex-row items-center justify-center gap-2 h-full min-h-[50px]">
              <Plus className="h-6 w-6 text-gray-400 group-hover:text-blue-600" />
              <p className="text-sm sm:text-base text-gray-600 group-hover:text-blue-600 font-medium">
                Create new board
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div>
        <Loader2 />
        <span>Loading your boards...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Error loading board...</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-grey-900 mb-2">
            Welcome back, {user?.firstName ?? user?.emailAddresses[0].emailAddress}! 👋
          </h1>
          <p className="text-grey-600">Here&apos;s what&apos;s happening with your boards today:</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6 ">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Boards</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{boards.length}</p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <KanbanSquare className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Show how many boards have been updated in the last 7 days */}
          <Card>
            <CardContent className="p-4 sm:p-6 ">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Recent Activity</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {
                      boards.filter((board) => {
                        const updatedAt = new Date(board.updated_at);
                        const oneWeekAgo = new Date();
                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                        return updatedAt > oneWeekAgo;
                      }).length
                    }
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CalendarClock className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6 ">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{boards.length}</p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Boards */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            {/* Boards header */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Boards</h2>
              <p className="text-gray-600">Manage your projects and tasks</p>
            </div>

            {/* Filters and controls */}
            <div>
              <ButtonGroup className="flex w-full flex-row flex-wrap sm:flex-nowrap sm:items-center space-y-2 sm:space-y-0">
                <ButtonGroup className="w-auto flex-none">
                  <Button
                    size="lg"
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3x3 />
                  </Button>
                  <Button
                    size="lg"
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    onClick={() => setViewMode('list')}
                  >
                    <List />
                  </Button>
                </ButtonGroup>

                <ButtonGroup className="w-auto flex-1">
                  <Button size="lg" variant="outline" className="w-full px-4">
                    <Filter /> Filter
                  </Button>
                </ButtonGroup>
                <ButtonGroup className="w-full sm:w-auto">
                  <Button size="lg" className="w-full" onClick={handleCreateBoard}>
                    <Plus /> Create Board
                  </Button>
                </ButtonGroup>
              </ButtonGroup>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4 sm:mb-6">
            <ButtonGroup className="w-full">
              <Button size="lg" variant="outline" aria-label="Search">
                <Search />
              </Button>
              <Input placeholder="Search..." className="placeholder:font-medium h-9 " />
            </ButtonGroup>
          </div>

          {/* Boards Grid/List */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
