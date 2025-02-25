'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Card } from '@workspace/ui/components/card';
import { useEffect } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@workspace/ui/components/chart';

interface ResultsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: {
    wpm: number;
    correctGuesses: number;
    incorrectGuesses: number;
    extraCharsCount: number;
    mismatchedCharsCount: number;
    totalGuesses: number;
    wordTimings: Array<{
      word: {
        word: string;
        isCorrect: boolean;
      };
      timestamp: number;
    }>;
    keystrokeCount: number;
    totalTime: number;
  };
}

export function ResultsDialog({ isOpen, onClose, metrics }: ResultsDialogProps) {
  // Calculate WPM data points for the chart
  const chartData = metrics.wordTimings.map((timing, index) => ({
    time: Math.floor(timing.timestamp / 1000), // Convert to seconds
    wpm: Math.round((index + 1) * (60 / (timing.timestamp / 1000))),
  }));





  
  const chartConfig = {
    wpm: {
      label: 'WPM',
      color: 'hsl(var(--foreground))',
    },
  } satisfies ChartConfig;
  

  // Calculate accuracy
  const accuracy = Math.round(
    (metrics.correctGuesses / (metrics.correctGuesses + metrics.incorrectGuesses)) * 100,
  );

  useEffect(() => {
    if(isOpen) console.log('ResultsDialog opened');
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && (e.key === 'Tab' || e.key === 'Enter')) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl bg-[var(--background)] text-[var(--foreground)]">
        <DialogHeader>
          <DialogTitle>Typing Test Results</DialogTitle>
          <DialogDescription>
            Here are your typing test results. Press Tab or Enter to start a new test.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <Card className="p-4 col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{metrics.wpm}</span>
                <span className="text-sm text-muted-foreground">WPM</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{accuracy}%</span>
                <span className="text-sm text-muted-foreground">Accuracy</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{metrics.keystrokeCount}</span>
                <span className="text-sm text-muted-foreground">Characters</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">
                  {metrics.incorrectGuesses + metrics.mismatchedCharsCount}
                </span>
                <span className="text-sm text-muted-foreground">Errors</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{metrics.totalTime}s</span>
                <span className="text-sm text-muted-foreground">Time</span>
              </div>
            </div>

            <ChartContainer config={chartConfig}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-wpm)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-wpm)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="wpm"
                  stroke="var(--color-wpm)"
                  fill="url(#wpmGradient)"
                  fillOpacity={1}
                />
              </AreaChart>
            </ChartContainer>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
