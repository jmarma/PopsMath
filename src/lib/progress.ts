'use client';

import { Progress } from '@/types';
import metadata from '@/data/metadata.json';
import practiceQuestions from '@/data/practice_questions.json';

const PROGRESS_KEY = 'chloes_math_lab_progress';

export function getProgress(): Progress {
  if (typeof window === 'undefined') {
    return { sectionsCompleted: [], practiceScores: {}, testScores: {} };
  }
  const stored = localStorage.getItem(PROGRESS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Migrate from old key if exists
  const oldStored = localStorage.getItem('popsmath_progress');
  if (oldStored) {
    localStorage.setItem(PROGRESS_KEY, oldStored);
    localStorage.removeItem('popsmath_progress');
    return JSON.parse(oldStored);
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

export function resetPracticeScore(sectionId: number): void {
  const progress = getProgress();
  delete progress.practiceScores[sectionId.toString()];
  saveProgress(progress);
}

/** Check if all practice questions across all sections have been answered correctly */
export function allPracticeComplete(): boolean {
  const progress = getProgress();
  const totalSections = metadata.total_sections;

  for (let i = 1; i <= totalSections; i++) {
    const score = progress.practiceScores[i.toString()];
    if (!score) return false;
    // Find the total questions for this section
    const sectionData = practiceQuestions.sections.find(s => s.section_id === i);
    if (!sectionData) return false;
    // Must have answered ALL questions AND gotten ALL correct
    if (score.correct < sectionData.questions.length || score.total < sectionData.questions.length) {
      return false;
    }
  }
  return true;
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PROGRESS_KEY);
}
