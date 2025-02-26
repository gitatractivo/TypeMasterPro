import { Word } from '@workspace/shared/types';

export interface User {
  id: string;
  name: string;
  roomId: string | null;
  progress: number;
  wpm: number;
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

export enum MessageType {
  CREATE_ROOM = 'create_room',
  JOIN_ROOM = 'join_room',
  START_GAME = 'start_game',
  UPDATE_PROGRESS = 'update_progress',
}

export interface ServerMessage {
  type: MessageType;
  payload: any;
}
