'use client';

import { useState, useCallback } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { generateCoolName } from '@workspace/shared/utils';

interface NameInputProps {
  onNameSubmit: (name: string) => void;
  isLoading?: boolean;
}

export const NameInput = ({ onNameSubmit, isLoading = false }: NameInputProps) => {
  const [name, setName] = useState('');

  const handleRandomName = useCallback(() => {
    setName(generateCoolName());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
          required
          minLength={2}
          maxLength={20}
          pattern="[A-Za-z0-9]+"
          title="Only letters and numbers are allowed"
        />
        <Button type="button" onClick={handleRandomName} variant="outline" className="w-full">
          Generate Random Name
        </Button>
      </div>
      <Button
        type="submit"
        className="w-full bg-[var(--primary)] text-[var(--background)] hover:bg-opacity-90"
        disabled={!name.trim() || isLoading}
      >
        {isLoading ? 'Submitting...' : 'Continue'}
      </Button>
    </form>
  );
};
