import { Char } from "./Char";

export type Word = {
  word: string;
  isGuessed: boolean;
  isCorrect: boolean;
  isPrevWrong: boolean;
  chars: Char[];
  extra: string;
};
