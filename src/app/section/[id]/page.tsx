'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { markSectionComplete, savePracticeScore, resetPracticeScore, getProgress } from '@/lib/progress';
import lessonPlan from '@/data/lesson_plan.json';
import practiceQuestions from '@/data/practice_questions.json';
import metadata from '@/data/metadata.json';
import MathText from '@/components/MathText';
import { ProportionalGraphDiagram, CircumferenceDiagram, AreaDiagram } from '@/components/MathDiagrams';

interface Question {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

const sectionDiagrams: Record<number, React.ReactNode> = {
  4: <ProportionalGraphDiagram />,
  5: <CircumferenceDiagram />,
  6: <AreaDiagram />,
};

export default function SectionPage() {
  const params = useParams();
  const sectionId = parseInt(params.id as string);
  
  const [activeTab, setActiveTab] = useState<'lesson' | 'practice'>('lesson');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);

  const lesson = lessonPlan.sections.find(s => s.section_id === sectionId);
  const sectionQuestions = practiceQuestions.sections.find(s => s.section_id === sectionId);
  const sectionMeta = metadata.sections.find(s => s.section_id === sectionId);
  const totalSections = metadata.total_sections;

  useEffect(() => {
    setMounted(true);
    const progress = getProgress();
    setIsCompleted(progress.sectionsCompleted.includes(sectionId));
  }, [sectionId]);

  if (!lesson || !sectionQuestions || !sectionMeta) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Section not found</h1>
        <Link href="/" className="btn-primary mt-4 inline-block">Go Home</Link>
      </div>
    );
  }

  const questions: Question[] = sectionQuestions.questions as Question[];

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const checkAnswer = (questionId: string) => {
    setShowResults(prev => ({ ...prev, [questionId]: true }));
    
    // Save progress after each answer
    const answeredQuestions = Object.keys({ ...showResults, [questionId]: true });
    const correctCount = answeredQuestions.filter(qId => {
      const q = questions.find(question => question.id === qId);
      return q && answers[qId] === q.correct_answer;
    }).length;
    savePracticeScore(sectionId, correctCount, answeredQuestions.length);
  };

  const handleResetPractice = () => {
    setAnswers({});
    setShowResults({});
    resetPracticeScore(sectionId);
  };

  const handleMarkComplete = () => {
    markSectionComplete(sectionId);
    setIsCompleted(true);
  };

  const getDifficultyBadge = (diff: string) => {
    const styles: Record<string, string> = {
      easy: 'difficulty-easy',
      medium: 'difficulty-medium',
      hard: 'difficulty-hard'
    };
    return styles[diff] || 'difficulty-medium';
  };

  const answeredCount = Object.keys(showResults).length;
  const correctCount = Object.keys(showResults).filter(qId => {
    const q = questions.find(question => question.id === qId);
    return q && answers[qId] === q.correct_answer;
  }).length;
  const allCorrect = answeredCount === questions.length && correctCount === questions.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="card mb-6 fade-in">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span>/</span>
          <span>Unit {metadata.unit_number}</span>
          <span>/</span>
          <span>Section {sectionId}</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {['📐', '🔑', '✏️', '📈', '⭕', '🔵'][sectionId - 1]} {lesson.title}
            </h1>
            <p className="text-gray-600">{sectionMeta.subtitle}</p>
          </div>
          {mounted && isCompleted && (
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
              ✓ Completed
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('lesson')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'lesson'
              ? 'bg-indigo-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          📖 Lesson
        </button>
        <button
          onClick={() => setActiveTab('practice')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'practice'
              ? 'bg-indigo-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          ✍️ Practice ({questions.length} questions)
        </button>
      </div>

      {/* Lesson Tab */}
      {activeTab === 'lesson' && (
        <div className="space-y-6 fade-in">
          {/* Introduction */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Introduction</h2>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4">
              <p className="text-indigo-700 font-medium italic">{lesson.introduction.hook}</p>
            </div>
            <p className="text-gray-700 leading-relaxed">{lesson.introduction.overview}</p>
          </div>

          {/* Section-specific diagram */}
          {sectionDiagrams[sectionId] && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Visual Guide</h2>
              {sectionDiagrams[sectionId]}
            </div>
          )}

          {/* Key Concepts */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 Key Concepts</h2>
            <div className="space-y-6">
              {lesson.key_concepts.map((concept, i) => (
                <div key={i} className="border-l-4 border-indigo-400 pl-4">
                  <h3 className="font-bold text-lg text-indigo-600 mb-2">
                    <MathText text={concept.concept} />
                  </h3>
                  <p className="text-gray-700 mb-3">
                    <MathText text={concept.simple_explanation} />
                  </p>
                  <div className="bg-green-50 rounded-lg p-3 mb-2">
                    <p className="text-sm font-medium text-green-700">📌 Real Example:</p>
                    <p className="text-green-800">
                      <MathText text={concept.real_world_example} />
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 italic">💭 {concept.visual_description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Examples */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 Step-by-Step Examples</h2>
            <div className="space-y-6">
              {lesson.step_by_step_examples.map((example, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold text-lg text-gray-800 mb-3">{example.title}</h3>
                  <div className="bg-yellow-50 rounded-lg p-3 mb-4">
                    <p className="font-medium text-yellow-800">
                      📋 Problem: <MathText text={example.problem} />
                    </p>
                  </div>
                  <div className="space-y-3 mb-4">
                    {example.steps.map((step) => (
                      <div key={step.step_number} className="flex gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                          {step.step_number}
                        </span>
                        <div>
                          <p className="font-medium text-gray-700">
                            <MathText text={step.instruction} />
                          </p>
                          <p className="text-indigo-600 font-mono bg-indigo-50 rounded px-2 py-1 mt-1 inline-block">
                            <MathText text={step.work} />
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-green-100 rounded-lg p-3">
                    <p className="font-bold text-green-700">
                      ✅ Answer: <MathText text={example.answer} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">⚠️ Common Mistakes to Avoid</h2>
            <div className="space-y-4">
              {lesson.common_mistakes.map((mistake, i) => (
                <div key={i} className="bg-red-50 rounded-xl p-4">
                  <h3 className="font-bold text-red-600 mb-2">❌ {mistake.mistake}</h3>
                  <p className="text-red-700 mb-2"><strong>Why it&apos;s wrong:</strong> {mistake.why_wrong}</p>
                  <p className="text-green-700"><strong>✅ How to avoid:</strong> {mistake.how_to_avoid}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Encouragement */}
          <div className="card bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <p className="text-xl text-center">{lesson.encouragement}</p>
          </div>

          {/* Mark Complete Button */}
          {mounted && !isCompleted && (
            <div className="text-center">
              <button onClick={handleMarkComplete} className="btn-primary text-lg">
                ✅ Mark Section as Complete
              </button>
            </div>
          )}
        </div>
      )}

      {/* Practice Tab */}
      {activeTab === 'practice' && (
        <div className="space-y-4 fade-in">
          {/* Progress */}
          {answeredCount > 0 && (
            <div className="card">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  Progress: {answeredCount}/{questions.length} answered
                </span>
                <span className="font-bold text-indigo-600">
                  Score: {correctCount}/{answeredCount} correct
                </span>
              </div>
              <div className="progress-bar mt-2">
                <div className="progress-fill" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
              </div>
              {answeredCount === questions.length && !allCorrect && (
                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Got some wrong? Review the lesson and try again!
                  </p>
                  <button
                    onClick={handleResetPractice}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-1 rounded-lg hover:bg-indigo-50"
                  >
                    🔄 Try Again
                  </button>
                </div>
              )}
              {allCorrect && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-green-600 font-semibold">
                    🎉 Perfect score! You&apos;ve mastered this section!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Questions */}
          {questions.map((q, index) => {
            const isAnswered = showResults[q.id];
            const selectedAnswer = answers[q.id];
            const isCorrect = selectedAnswer === q.correct_answer;

            return (
              <div
                key={q.id}
                className={`question-card ${isAnswered ? (isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50') : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-gray-400 font-medium">Question {index + 1}</span>
                  <span className={getDifficultyBadge(q.difficulty)}>{q.difficulty}</span>
                </div>
                <p className="text-gray-800 font-medium mb-4 whitespace-pre-line">
                  <MathText text={q.question} />
                </p>
                
                <div className="space-y-2 mb-4">
                  {q.options.map((option, optIndex) => {
                    const optionLetter = option.charAt(0);
                    const isSelected = selectedAnswer === optionLetter;
                    const isCorrectOption = optionLetter === q.correct_answer;
                    
                    let optionStyles = 'border-2 border-gray-200 hover:border-indigo-300 bg-white';
                    if (isAnswered) {
                      if (isCorrectOption) {
                        optionStyles = 'border-2 border-green-500 bg-green-100';
                      } else if (isSelected && !isCorrectOption) {
                        optionStyles = 'border-2 border-red-500 bg-red-100';
                      }
                    } else if (isSelected) {
                      optionStyles = 'border-2 border-indigo-500 bg-indigo-50';
                    }

                    return (
                      <button
                        key={optIndex}
                        onClick={() => !isAnswered && handleAnswer(q.id, optionLetter)}
                        disabled={isAnswered}
                        className={`w-full text-left p-3 rounded-lg transition-all ${optionStyles} ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <MathText text={option} />
                        {isAnswered && isCorrectOption && <span className="float-right text-green-600">✓</span>}
                        {isAnswered && isSelected && !isCorrectOption && <span className="float-right text-red-600">✗</span>}
                      </button>
                    );
                  })}
                </div>

                {!isAnswered && selectedAnswer && (
                  <button
                    onClick={() => checkAnswer(q.id)}
                    className="btn-primary w-full"
                  >
                    Check Answer
                  </button>
                )}

                {isAnswered && (
                  <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-yellow-100'}`}>
                    <p className="font-bold mb-2">
                      {isCorrect ? '🎉 Correct!' : '💡 Not quite - here\'s the explanation:'}
                    </p>
                    <p className="text-gray-700">
                      <MathText text={q.explanation} />
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Mark Complete if all answered */}
          {mounted && answeredCount === questions.length && !isCompleted && (
            <div className="text-center">
              <button onClick={handleMarkComplete} className="btn-primary text-lg">
                ✅ Mark Section as Complete
              </button>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {sectionId > 1 ? (
          <Link href={`/section/${sectionId - 1}`} className="btn-secondary">
            ← Previous Section
          </Link>
        ) : <div />}
        {sectionId < totalSections ? (
          <Link href={`/section/${sectionId + 1}`} className="btn-primary">
            Next Section →
          </Link>
        ) : (
          <Link href="/test/1" className="btn-primary">
            Take Test 1 →
          </Link>
        )}
      </div>
    </div>
  );
}
