import { generate } from 'random-words';
import { Word } from './types';

export const generateWords = (numberOfWords: number): Word[] => {
  let words = generate({ exactly: numberOfWords, wordsPerString: 1 });
  if (typeof words === 'string') {
    words = [words];
  }
  const date = new Date();
  const wordsArray = words.map((word, index) => {
    return {
      id: word + ':' + index + ':' + date.getTime(),
      word,
      isGuessed: false,
      isCorrect: false,
      isPrevWrong: false,
      chars: word.split('').map((char) => {
        return {
          char,
          isCorrect: false,
          isGuessed: false,
        };
      }),
      extra: '',
    };
  });

  return wordsArray;
};

export const calculateLeaderProgress = (progresses: {
  [userId: string]: { progress: number; wpm: number };
}) => {
  let maxProgress = 0;
  let leaderId = '';
  let leaderWpm = 0;

  Object.entries(progresses).forEach(([userId, data]) => {
    if (data.progress > maxProgress) {
      maxProgress = data.progress;
      leaderId = userId;
      leaderWpm = data.wpm;
    }
  });

  return {
    userId: leaderId,
    progress: maxProgress,
    wpm: leaderWpm,
  };
};
