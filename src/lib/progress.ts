'use client';

import { Progress } from '@/types';

const PROGRESS_KEY = 'popsmath_progress';

export function getProgress(): Progress {
  if (typeof window === 'undefined') {
    return { sectionsCompleted: [], practiceScores: {}, testScores: {} };
  }
  const stored = localStorage.getItem(PROGRESS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return { sectionsCompleted: [], practiceScores: {}, testScores: {} };
}

export function saveProgress(progress: Progress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function markSectionComplete(sectionId: number): void {
  const progress = getProgress();
  if (!progress.sectionsCompleted.includes(sectionId)) {
    progress.sectionsCompleted.push(sectionId);
    saveProgress(progress);
  }
}

export function savePracticeScore(sectionId: number, correct: number, total: number): void {
  const progress = getProgress();
  progress.practiceScores[sectionId.toString()] = { correct, total };
  saveProgress(progress);
}

export function saveTestScore(testId: number, score: number): void {
  const progress = getProgress();
  progress.testScores[testId.toString()] = score;
  saveProgress(progress);
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PROGRESS_KEY);
}
