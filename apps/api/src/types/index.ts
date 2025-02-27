
import { Word } from '@workspace/shared/types';

export interface User {
  id: string;
  name: string;
  roomId: string | null;
  progress: number;
  wpm: number;
  sendMessage(type: string, payload: any): void;
  reset(): void;
}

export interface Room {
  id: string;
  users: Map<string, User>;
  status: RoomStatus;
  words: Word[];
  startTime: number | null;
  endTime: number | null;
  duration: number;
}

export enum RoomStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
}

export interface ServerMessage {
  type: string;
  payload: any;
}
