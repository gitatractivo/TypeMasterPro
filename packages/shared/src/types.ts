export type Char = {
  char: string;
  isCorrect: boolean;
  isGuessed: boolean;
};

export type Word = {
  id: string;
  word: string;
  isGuessed: boolean;
  isCorrect: boolean;
  isPrevWrong: boolean;
  chars: Char[];
  extra: string;
};

export type GameProgress = {
  userId: string;
  currentWordId: string;
  currentCharIndex: number;
  totalProgress: number;
  wpm: number;
};

export type GameConfig = {
  duration: number; // in seconds
  numberOfWords: number;
};

export enum MessageType {
  CREATE_ROOM = 'create_room',
  JOIN_ROOM = 'join_room',
  START_GAME = 'start_game',
  UPDATE_PROGRESS = 'update_progress',
}
