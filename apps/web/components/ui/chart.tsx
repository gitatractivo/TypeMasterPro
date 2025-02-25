'use client';

import { HTMLAttributes } from 'react';
import { cn } from '@workspace/ui/lib/utils';

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface ChartContainerProps extends HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
}

export function ChartContainer({ config, children, className, ...props }: ChartContainerProps) {
  return (
    <div
      className={cn('h-[200px] w-full', className)}
      style={
        {
          '--color-wpm': 'hsl(var(--primary))',
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}

export function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-wpm)]" />
          <span className="text-[0.70rem] font-medium">WPM</span>
        </div>
        <span className="text-[0.70rem] font-medium">{payload[0].value.toFixed(0)}</span>
      </div>
      <span className="text-[0.70rem] text-muted-foreground">{label}s</span>
    </div>
  );
}
