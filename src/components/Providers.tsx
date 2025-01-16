"use client";
import React from "react";
import { ThemeProvider } from "@/components/ThemeContext";
import { WordProvider } from "@/components/WordContext";
import ErrorBoundary from "@/components/ErrorBoundary";

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const handleTimerEnd = () => {
    console.log("Timer ended");
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <WordProvider onTimerEnd={handleTimerEnd}>{children}</WordProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default Providers;
