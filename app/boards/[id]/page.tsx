'use client';

import Navbar from '@/components/navbar';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import { useBoard } from '@/lib/hooks/useBoards';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
// import { useState } from 'react';

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const { board, loading, error } = useBoard(id);

  console.log(board);

  // const [isEditing, setIsEditing] = useState(false);
  // const [newTitle, setNewTitle] = useState('');
  // const [newColor, setNewColor] = useState('');

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
      <Navbar
        boardTitle={board?.title}
        boardColor={board?.color}
        // onEditBoard={() => {
        //   setNewTitle(board?.title ?? '');
        //   setNewColor(board?.color ?? '');

        //   setIsEditing(true);
        // }}
      />

      {/* Not ready yet

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
          </DialogHeader>
          <DialogContent>
            <form>
              <div>
                <Label htmlFor="boardTitle">Board Title</Label>
                <Input
                  type="text"
                  id="boardTitle"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter board title..."
                />
              </div>
            </form>
          </DialogContent>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
