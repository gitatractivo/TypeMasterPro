'use client';

import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { useWebSocket } from '@/hooks/useWebSocket';
import { MessageType } from '@workspace/shared/types';
import { NameInput } from '@/components/NameInput';

export default function RoomPage() {
  const [roomId, setRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const { sendMessage } = useWebSocket();

  const handleCreateRoom = async () => {
    if (!userName) return;
    try {
      setIsCreating(true);
      sendMessage({
        type: MessageType.CREATE_ROOM,
        payload: {
          name: userName,
          numberOfWords: 50,
        },
      });
      // The room navigation will be handled by the WebSocket event handler
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomId || !userName) return;
    try {
      setIsJoining(true);
      sendMessage({
        type: MessageType.JOIN_ROOM,
        payload: {
          roomId,
          name: userName,
        },
      });
      // The room navigation will be handled by the WebSocket event handler
    } catch (error) {
      console.error('Error joining room:', error);
    } finally {
      setIsJoining(false);
    }
  };

  if (!userName) {
    return (
      <div className="container mx-auto mt-20 flex justify-center">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to TypeMasterPro</CardTitle>
              <CardDescription>Choose your typing name</CardDescription>
            </CardHeader>
            <CardContent>
              <NameInput onNameSubmit={setUserName} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-20 flex justify-center">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Collaborative Typing</CardTitle>
            <CardDescription>Create a new room or join an existing one</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleCreateRoom}
              className="w-full bg-[var(--primary)] text-[var(--background)] hover:bg-opacity-90"
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create New Room'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[var(--primary)]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[var(--background)] px-2 text-[var(--primary)]">Or</span>
              </div>
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full"
              />
              <Button
                onClick={handleJoinRoom}
                className="w-full bg-[var(--primary)] text-[var(--background)] hover:bg-opacity-90"
                disabled={!roomId || isJoining}
              >
                {isJoining ? 'Joining...' : 'Join Room'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
