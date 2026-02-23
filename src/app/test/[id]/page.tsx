'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { saveTestScore, getProgress, allPracticeComplete } from '@/lib/progress';
import test1 from '@/data/test_1.json';
import test2 from '@/data/test_2.json';
import MathText from '@/components/MathText';

const EXPLANATION_PASSWORD = 'PopsMath2024';

interface TestQuestion {
  question_number: number;
  difficulty: 'easy' | 'medium' | 'hard';
  section_covered: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface TestData {
  test_info: {
    test_number: number;
    title: string;
    description: string;
    total_questions: number;
    time_suggestion: string;
    encouragement: string;
  };
  questions: TestQuestion[];
  answer_key_summary: {
    answers: string[];
    score_guide: Record<string, string>;
  };
}

export default function TestPage() {
  const params = useParams();
  const testId = parseInt(params.id as string);
  
  const [viewMode, setViewMode] = useState<'all' | 'one'>('one');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [previousBestScore, setPreviousBestScore] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [practiceComplete, setPracticeComplete] = useState(false);
  
  // States for retry flow
  const [showingRetry, setShowingRetry] = useState(false);
  const [retryAnswers, setRetryAnswers] = useState<Record<number, string>>({});
  const [retryScore, setRetryScore] = useState(0);
  const [showExplanations, setShowExplanations] = useState(false);
  const [explanationPassword, setExplanationPassword] = useState('');
  const [explanationPasswordError, setExplanationPasswordError] = useState(false);

  const testData = (testId === 1 ? test1 : test2) as TestData;
  const questions = testData.questions;

  useEffect(() => {
    setMounted(true);
    const progress = getProgress();
    const prevScore = progress.testScores[testId.toString()];
    if (prevScore !== undefined) {
      setPreviousBestScore(prevScore);
    }
    setPracticeComplete(allPracticeComplete());
  }, [testId]);

  const handleAnswer = (questionNum: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionNum]: answer }));
  };

  const handleRetryAnswer = (questionNum: number, answer: string) => {
    setRetryAnswers(prev => ({ ...prev, [questionNum]: answer }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.question_number] === q.correct_answer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setIsSubmitted(true);
    
    // Save score if it's better than previous
    const progress = getProgress();
    const prevScore = progress.testScores[testId.toString()];
    if (prevScore === undefined || correctCount > prevScore) {
      saveTestScore(testId, correctCount);
    }
  };

  const handleRetrySubmit = () => {
    let correctCount = score; // Start with original correct answers
    const incorrectQuestions = questions.filter(q => answers[q.question_number] !== q.correct_answer);
    
    incorrectQuestions.forEach(q => {
      if (retryAnswers[q.question_number] === q.correct_answer) {
        correctCount++;
      }
    });
    
    setRetryScore(correctCount);
    setShowingRetry(false);
    
    // Save updated score if it's better
    const progress = getProgress();
    const prevScore = progress.testScores[testId.toString()];
    if (prevScore === undefined || correctCount > prevScore) {
      saveTestScore(testId, correctCount);
    }
  };

  const handleExplanationPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (explanationPassword === EXPLANATION_PASSWORD) {
      setShowExplanations(true);
      setExplanationPasswordError(false);
    } else {
      setExplanationPasswordError(true);
    }
  };

  const getScoreMessage = (currentScore: number) => {
    const percentage = (currentScore / 20) * 100;
    if (percentage >= 90) return testData.answer_key_summary.score_guide['18-20'];
    if (percentage >= 75) return testData.answer_key_summary.score_guide['15-17'];
    if (percentage >= 60) return testData.answer_key_summary.score_guide['12-14'];
    if (percentage >= 45) return testData.answer_key_summary.score_guide['9-11'];
    return testData.answer_key_summary.score_guide['0-8'];
  };

  const getDifficultyBadge = (diff: string) => {
    const styles: Record<string, string> = {
      easy: 'difficulty-easy',
      medium: 'difficulty-medium',
      hard: 'difficulty-hard'
    };
    return styles[diff] || 'difficulty-medium';
  };

  const answeredCount = Object.keys(answers).length;
  const incorrectQuestions = questions.filter(q => answers[q.question_number] !== q.correct_answer);
  const retryAnsweredCount = Object.keys(retryAnswers).length;

  // Locked Screen - practice not complete
  if (mounted && !practiceComplete) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card text-center fade-in">
          <span className="text-6xl mb-4 block">🔒</span>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{testData.test_info.title}</h1>
          <p className="text-gray-600 mb-6">{testData.test_info.description}</p>
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 max-w-lg mx-auto mb-6">
            <h2 className="text-lg font-bold text-amber-800 mb-2">Complete All Practice First!</h2>
            <p className="text-amber-700">
              You need to get a perfect score on all section practice questions before you can take this test.
              Go back and make sure you&apos;ve gotten every practice question right!
            </p>
          </div>
          <Link href="/" className="btn-primary">
            ← Back to Sections
          </Link>
        </div>
      </div>
    );
  }

  // Initial Results Screen (after first submission, before retry)
  if (isSubmitted && !showingRetry && retryScore === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card text-center mb-8 fade-in">
          <span className="text-6xl mb-4 block">{score >= 15 ? '🎉' : score >= 10 ? '👍' : '💪'}</span>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Test Complete!</h1>
          <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {score} / 20
          </div>
          <p className="text-lg text-gray-600 mb-4">{getScoreMessage(score)}</p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-green-600">{score}</p>
              <p className="text-sm text-green-700">Correct</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-red-600">{20 - score}</p>
              <p className="text-sm text-red-700">Incorrect</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-indigo-600">{Math.round((score / 20) * 100)}%</p>
              <p className="text-sm text-indigo-700">Score</p>
            </div>
          </div>

          {incorrectQuestions.length > 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 font-medium mb-2">
                💡 Want to try again? You can retry the questions you got wrong!
              </p>
              <button
                onClick={() => setShowingRetry(true)}
                className="btn-primary mt-2"
              >
                Retry Incorrect Questions ({incorrectQuestions.length})
              </button>
            </div>
          )}
        </div>

        {/* Explanation password gate */}
        {!showExplanations ? (
          <div className="card mb-8 fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🔒 View Explanations &amp; Correct Answers</h2>
              <p className="text-gray-600 mb-6">
                Ask your parent for the password to see detailed explanations
              </p>
              
              <form onSubmit={handleExplanationPasswordSubmit} className="max-w-md mx-auto">
                <div className="mb-4">
                  <input
                    type="password"
                    value={explanationPassword}
                    onChange={(e) => setExplanationPassword(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      explanationPasswordError ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="Enter password..."
                  />
                  {explanationPasswordError && (
                    <p className="text-red-500 text-sm mt-2">Incorrect password. Please try again.</p>
                  )}
                </div>
                <button type="submit" className="btn-primary w-full">
                  View Explanations
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 Your Results with Explanations</h2>
            <div className="space-y-4">
              {questions.map((q) => {
                const userAnswer = answers[q.question_number];
                const isCorrect = userAnswer === q.correct_answer;
                
                return (
                  <div
                    key={q.question_number}
                    className={`card ${isCorrect ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-gray-500 font-medium">Question {q.question_number}</span>
                      <div className="flex gap-2">
                        <span className={getDifficultyBadge(q.difficulty)}>{q.difficulty}</span>
                        <span className={isCorrect ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-800 font-medium mb-3 whitespace-pre-line">
                      <MathText text={q.question} />
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      {q.options.map((option, i) => {
                        const optionLetter = option.charAt(0);
                        const isCorrectAnswer = optionLetter === q.correct_answer;
                        const isUserAnswer = userAnswer === optionLetter;
                        
                        let styles = 'border border-gray-200 bg-white';
                        if (isCorrectAnswer) {
                          styles = 'border-2 border-green-500 bg-green-50';
                        } else if (isUserAnswer && !isCorrect) {
                          styles = 'border-2 border-red-500 bg-red-50';
                        }
                        
                        return (
                          <div key={i} className={`p-3 rounded-lg ${styles}`}>
                            <MathText text={option} />
                            {isCorrectAnswer && <span className="float-right text-green-600 font-medium">✓ Correct Answer</span>}
                            {isUserAnswer && !isCorrect && <span className="float-right text-red-600 font-medium">Your answer</span>}
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Section: {q.section_covered}</p>
                      <p className="text-blue-800"><strong>Explanation:</strong> <MathText text={q.explanation} /></p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="flex justify-center gap-4 mt-8">
          <Link href="/" className="btn-secondary">Back to Home</Link>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Retake Test
          </button>
        </div>
      </div>
    );
  }

  // Retry Screen
  if (showingRetry) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card mb-6 fade-in">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">🔄 Retry Incorrect Questions</h1>
          <p className="text-gray-600 mb-4">
            Try these {incorrectQuestions.length} questions again. Take your time and think carefully!
          </p>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-blue-800">
              <strong>Current Score:</strong> {score}/20 • 
              <strong className="ml-2">Questions to Retry:</strong> {incorrectQuestions.length}
            </p>
          </div>
        </div>

        <div className="space-y-4 fade-in">
          {incorrectQuestions.map((q) => {
            const originalAnswer = answers[q.question_number];
            const retryAnswer = retryAnswers[q.question_number];
            
            return (
              <div key={q.question_number} className="card border-l-4 border-yellow-500">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-gray-500 font-medium">Question {q.question_number}</span>
                  <span className={getDifficultyBadge(q.difficulty)}>{q.difficulty}</span>
                </div>
                <p className="text-gray-800 font-medium mb-4 whitespace-pre-line">
                  <MathText text={q.question} />
                </p>
                
                <div className="space-y-2">
                  {q.options.map((option, i) => {
                    const optionLetter = option.charAt(0);
                    const isOriginalAnswer = originalAnswer === optionLetter;
                    const isRetrySelected = retryAnswer === optionLetter;
                    
                    let styles = 'border-2 transition-all';
                    if (isRetrySelected) {
                      styles += ' border-indigo-500 bg-indigo-50';
                    } else if (isOriginalAnswer) {
                      styles += ' border-red-300 bg-red-50 opacity-60';
                    } else {
                      styles += ' border-gray-200 hover:border-indigo-300 bg-white';
                    }
                    
                    return (
                      <button
                        key={i}
                        onClick={() => handleRetryAnswer(q.question_number, optionLetter)}
                        className={`w-full text-left p-3 rounded-lg ${styles}`}
                      >
                        <MathText text={option} />
                        {isOriginalAnswer && (
                          <span className="float-right text-red-600 text-sm">Previous answer</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="card text-center mt-6">
          <button
            onClick={handleRetrySubmit}
            disabled={retryAnsweredCount < incorrectQuestions.length}
            className="btn-primary text-lg disabled:opacity-50 mr-4"
          >
            Submit Retry ({retryAnsweredCount}/{incorrectQuestions.length} answered)
          </button>
          <button
            onClick={() => setShowingRetry(false)}
            className="btn-secondary"
          >
            Cancel
          </button>
          {retryAnsweredCount < incorrectQuestions.length && (
            <p className="text-gray-500 mt-2">Please answer all retry questions before submitting</p>
          )}
        </div>
      </div>
    );
  }

  // Final Results Screen (after retry)
  if (isSubmitted && retryScore > 0) {
    const finalScore = retryScore;
    const improvement = finalScore - score;
    
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card text-center mb-8 fade-in">
          <span className="text-6xl mb-4 block">
            {improvement > 0 ? '🎉' : finalScore >= 15 ? '🎉' : finalScore >= 10 ? '👍' : '💪'}
          </span>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {improvement > 0 ? 'Great Improvement!' : 'Final Results'}
          </h1>
          
          {improvement > 0 && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-medium text-lg">
                You improved by {improvement} question{improvement > 1 ? 's' : ''}! 🌟
              </p>
            </div>
          )}
          
          <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {finalScore} / 20
          </div>
          <p className="text-lg text-gray-600 mb-4">{getScoreMessage(finalScore)}</p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-green-600">{finalScore}</p>
              <p className="text-sm text-green-700">Final Correct</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-blue-600">{score}</p>
              <p className="text-sm text-blue-700">First Try</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-indigo-600">{Math.round((finalScore / 20) * 100)}%</p>
              <p className="text-sm text-indigo-700">Final Score</p>
            </div>
          </div>
        </div>

        {!showExplanations ? (
          <div className="card mb-8 fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🔒 View Detailed Explanations</h2>
              <p className="text-gray-600 mb-6">
                Ask your parent for the password to see detailed explanations
              </p>
              
              <form onSubmit={handleExplanationPasswordSubmit} className="max-w-md mx-auto">
                <div className="mb-4">
                  <input
                    type="password"
                    value={explanationPassword}
                    onChange={(e) => setExplanationPassword(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      explanationPasswordError ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="Enter password..."
                  />
                  {explanationPasswordError && (
                    <p className="text-red-500 text-sm mt-2">Incorrect password. Please try again.</p>
                  )}
                </div>
                <button type="submit" className="btn-primary w-full">
                  View Explanations
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 Detailed Results with Explanations</h2>
            <div className="space-y-4">
              {questions.map((q) => {
                const originalAnswer = answers[q.question_number];
                const wasOriginallyCorrect = originalAnswer === q.correct_answer;
                const retryAnswer = retryAnswers[q.question_number];
                const finalAnswer = retryAnswer || originalAnswer;
                const isFinalCorrect = finalAnswer === q.correct_answer;
                
                return (
                  <div
                    key={q.question_number}
                    className={`card ${isFinalCorrect ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-gray-500 font-medium">Question {q.question_number}</span>
                      <div className="flex gap-2">
                        <span className={getDifficultyBadge(q.difficulty)}>{q.difficulty}</span>
                        {!wasOriginallyCorrect && retryAnswer && (
                          <span className="text-blue-600 font-medium text-sm">Retried</span>
                        )}
                        <span className={isFinalCorrect ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                          {isFinalCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-800 font-medium mb-3 whitespace-pre-line">
                      <MathText text={q.question} />
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      {q.options.map((option, i) => {
                        const optionLetter = option.charAt(0);
                        const isCorrectAnswer = optionLetter === q.correct_answer;
                        const isFinalAnswer = finalAnswer === optionLetter;
                        const isOriginalAnswer = originalAnswer === optionLetter && !wasOriginallyCorrect;
                        
                        let styles = 'border border-gray-200 bg-white';
                        if (isCorrectAnswer) {
                          styles = 'border-2 border-green-500 bg-green-50';
                        } else if (isFinalAnswer && !isFinalCorrect) {
                          styles = 'border-2 border-red-500 bg-red-50';
                        } else if (isOriginalAnswer && retryAnswer) {
                          styles = 'border border-red-300 bg-red-50 opacity-50';
                        }
                        
                        return (
                          <div key={i} className={`p-3 rounded-lg ${styles}`}>
                            <MathText text={option} />
                            {isCorrectAnswer && <span className="float-right text-green-600 font-medium">✓ Correct Answer</span>}
                            {isFinalAnswer && !isFinalCorrect && <span className="float-right text-red-600 font-medium">Your final answer</span>}
                            {isOriginalAnswer && retryAnswer && <span className="float-right text-red-400 text-sm">First try</span>}
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Section: {q.section_covered}</p>
                      <p className="text-blue-800"><strong>Explanation:</strong> <MathText text={q.explanation} /></p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="flex justify-center gap-4 mt-8">
          <Link href="/" className="btn-secondary">Back to Home</Link>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Retake Test
          </button>
        </div>
      </div>
    );
  }

  // Test Taking Screen (no password required - just need practice complete)
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="card mb-6 fade-in">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{testData.test_info.title}</h1>
            <p className="text-gray-600">{testData.test_info.description}</p>
            <p className="text-gray-500 text-sm mt-1">{testData.test_info.time_suggestion}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-indigo-600">{answeredCount} / 20 answered</p>
            <div className="progress-bar w-32">
              <div className="progress-fill" style={{ width: `${(answeredCount / 20) * 100}%` }} />
            </div>
          </div>
        </div>

        {mounted && previousBestScore !== null && (
          <div className="bg-green-50 rounded-lg p-3 mt-4">
            <p className="text-green-700">Your previous best score: <strong>{previousBestScore}/20</strong></p>
          </div>
        )}

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setViewMode('one')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'one' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            One at a time
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'all' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All questions
          </button>
        </div>
      </div>

      {/* Encouragement */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-6 text-center">
        <p className="text-indigo-700 font-medium">{testData.test_info.encouragement}</p>
      </div>

      {/* One at a time view */}
      {viewMode === 'one' && (
        <div className="fade-in">
          <div className="card mb-4">
            <div className="flex items-start justify-between mb-3">
              <span className="text-gray-500 font-medium">Question {currentQuestion + 1} of 20</span>
              <span className={getDifficultyBadge(questions[currentQuestion].difficulty)}>
                {questions[currentQuestion].difficulty}
              </span>
            </div>
            <p className="text-gray-800 font-medium text-lg mb-4 whitespace-pre-line">
              <MathText text={questions[currentQuestion].question} />
            </p>
            
            <div className="space-y-2">
              {questions[currentQuestion].options.map((option, i) => {
                const optionLetter = option.charAt(0);
                const isSelected = answers[questions[currentQuestion].question_number] === optionLetter;
                
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(questions[currentQuestion].question_number, optionLetter)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300 bg-white'
                    }`}
                  >
                    <MathText text={option} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestion(i)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  i === currentQuestion
                    ? 'bg-indigo-500 text-white'
                    : answers[i + 1]
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="btn-secondary disabled:opacity-50"
            >
              ← Previous
            </button>
            {currentQuestion === 19 ? (
              <button
                onClick={handleSubmit}
                disabled={answeredCount < 20}
                className="btn-primary disabled:opacity-50"
              >
                Submit Test ({answeredCount}/20)
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(Math.min(19, currentQuestion + 1))}
                className="btn-primary"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      )}

      {/* All questions view */}
      {viewMode === 'all' && (
        <div className="space-y-4 fade-in">
          {questions.map((q) => (
            <div key={q.question_number} className="question-card">
              <div className="flex items-start justify-between mb-3">
                <span className="text-gray-500 font-medium">Question {q.question_number}</span>
                <span className={getDifficultyBadge(q.difficulty)}>{q.difficulty}</span>
              </div>
              <p className="text-gray-800 font-medium mb-4 whitespace-pre-line">
                <MathText text={q.question} />
              </p>
              
              <div className="space-y-2">
                {q.options.map((option, i) => {
                  const optionLetter = option.charAt(0);
                  const isSelected = answers[q.question_number] === optionLetter;
                  
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(q.question_number, optionLetter)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300 bg-white'
                      }`}
                    >
                      <MathText text={option} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="card text-center">
            <button
              onClick={handleSubmit}
              disabled={answeredCount < 20}
              className="btn-primary text-lg disabled:opacity-50"
            >
              Submit Test ({answeredCount}/20 answered)
            </button>
            {answeredCount < 20 && (
              <p className="text-gray-500 mt-2">Please answer all questions before submitting</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
