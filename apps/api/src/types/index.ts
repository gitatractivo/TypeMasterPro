export interface User {
  id: string;
  name: string;
  socket: WebSocket;
  roomId: string | null;
  wpm: number;
  progress: number;
}

export interface Room {
  id: string;
  users: Map<string, User>;
  status: RoomStatus;
  text: string;
  startTime: number | null;
  endTime: number | null;
}

export enum RoomStatus {
  WAITING = "waiting",
  STARTING = "starting",
  IN_PROGRESS = "in_progress",
  FINISHED = "finished",
}

export interface ServerMessage {
  type: MessageType;
  payload: any;
}

export enum MessageType {
  JOIN_ROOM = "join_room",
  CREATE_ROOM = "create_room",
  USER_JOINED = "user_joined",
  START_GAME = "start_game",
  GAME_STARTED = "game_started",
  UPDATE_PROGRESS = "update_progress",
  GAME_FINISHED = "game_finished",
  ERROR = "error",
}
