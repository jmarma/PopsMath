export interface Section {
  section_id: number;
  title: string;
  subtitle: string;
  estimated_time: string;
  difficulty: string;
}

export interface Question {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface TestQuestion {
  question_number: number;
  difficulty: 'easy' | 'medium' | 'hard';
  section_covered: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface LessonConcept {
  concept: string;
  simple_explanation: string;
  real_world_example: string;
  visual_description: string;
}

export interface StepByStepExample {
  title: string;
  problem: string;
  steps: { step_number: number; instruction: string; work: string }[];
  answer: string;
}

export interface CommonMistake {
  mistake: string;
  why_wrong: string;
  how_to_avoid: string;
}

export interface LessonSection {
  section_id: number;
  title: string;
  introduction: { hook: string; overview: string };
  key_concepts: LessonConcept[];
  step_by_step_examples: StepByStepExample[];
  common_mistakes: CommonMistake[];
  encouragement: string;
}

export interface Progress {
  sectionsCompleted: number[];
  practiceScores: { [sectionId: string]: { correct: number; total: number } };
  testScores: { [testId: string]: number };
}
