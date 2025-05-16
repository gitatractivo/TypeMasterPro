//@ts-ignore
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

const adjectives = [
  'Swift',
  'Rapid',
  'Nimble',
  'Quick',
  'Fast',
  'Speedy',
  'Agile',
  'Deft',
  'Elite',
  'Prime',
  'Master',
  'Expert',
  'Pro',
  'Ace',
  'Champion',
  'Star',
  'Royal',
  'Epic',
  'Legendary',
  'Mystic',
  'Cosmic',
  'Divine',
  'Supreme',
  'Ultra',
  'Cyber',
  'Tech',
  'Digital',
  'Quantum',
  'Neon',
  'Pixel',
  'Binary',
  'Code',
];

const nouns = [
  'Typer',
  'Typist',
  'Writer',
  'Scribe',
  'Wizard',
  'Master',
  'Phoenix',
  'Dragon',
  'Eagle',
  'Falcon',
  'Tiger',
  'Lion',
  'Panther',
  'Wolf',
  'Ninja',
  'Samurai',
  'Knight',
  'Warrior',
  'Legend',
  'Hero',
  'Champion',
  'Prodigy',
  'Sage',
  'Maven',
  'Coder',
  'Hacker',
  'Programmer',
  'Developer',
  'Engineer',
  'Builder',
  'Creator',
  'Smith',
];

export const generateCoolName = (): string => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  //add a random number between 1 and 1000
  const randomNumber = Math.floor(Math.random() * 1000);
  return `${adjective}${noun}${randomNumber}`;
};

export const isNameTaken = (name: string, existingNames: string[]): boolean => {
  return existingNames.some((existingName) => existingName === name);
};
