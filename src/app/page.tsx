'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProgress, allPracticeComplete } from '@/lib/progress';
import metadata from '@/data/metadata.json';
import practiceQuestions from '@/data/practice_questions.json';

export default function Home() {
  const [progress, setProgress] = useState({ sectionsCompleted: [] as number[], practiceScores: {} as Record<string, { correct: number; total: number }>, testScores: {} as Record<string, number> });
  const [mounted, setMounted] = useState(false);
  const [testsUnlocked, setTestsUnlocked] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProgress(getProgress());
    setTestsUnlocked(allPracticeComplete());
  }, []);

  const totalSections = metadata.total_sections;
  const completionPercent = mounted ? Math.round((progress.sectionsCompleted.length / totalSections) * 100) : 0;

  const getDifficultyColor = (diff: string) => {
    if (diff === 'Foundation') return 'bg-green-100 text-green-700';
    if (diff === 'Building') return 'bg-yellow-100 text-yellow-700';
    return 'bg-purple-100 text-purple-700';
  };

  // Count how many sections have perfect practice scores
  const perfectPracticeSections = mounted ? metadata.sections.filter((section) => {
    const score = progress.practiceScores[section.section_id.toString()];
    const sectionData = practiceQuestions.sections.find(s => s.section_id === section.section_id);
    return score && sectionData && score.correct >= sectionData.questions.length;
  }).length : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="card mb-8 text-center fade-in">
        <div className="text-6xl mb-4 emoji-bounce">🎯</div>
        <p className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">
          Unit {metadata.unit_number} • {metadata.grade_level}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          {metadata.unit_title}
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-4">
          {metadata.description}
        </p>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 max-w-2xl mx-auto">
          <p className="text-indigo-700 font-medium">{metadata.encouragement_message}</p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="card mb-8 fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">📊 Your Progress</h2>
          <span className="text-3xl font-bold text-indigo-600">{completionPercent}%</span>
        </div>
        <div className="progress-bar mb-2">
          <div className="progress-fill" style={{ width: `${completionPercent}%` }} />
        </div>
        <p className="text-gray-500 text-sm">
          {mounted ? `${progress.sectionsCompleted.length} of ${totalSections} sections completed` : 'Loading...'}
        </p>

        {mounted && Object.keys(progress.testScores).length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="font-semibold text-gray-700 mb-2">🏆 Test Scores</h3>
            <div className="flex gap-4">
              {Object.entries(progress.testScores).map(([testId, score]) => (
                <div key={testId} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg px-4 py-2">
                  <span className="text-sm text-gray-600">Test {testId}:</span>
                  <span className="ml-2 font-bold text-green-600">{score}/20</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {mounted && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-400">
              💾 Your progress is saved in this browser. Use the same browser and device to keep your progress.
            </p>
          </div>
        )}
      </div>

      {/* Sections Grid */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 Unit {metadata.unit_number} Sections</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {metadata.sections.map((section, index) => {
          const isCompleted = mounted && progress.sectionsCompleted.includes(section.section_id);
          const practiceScore = mounted ? progress.practiceScores[section.section_id.toString()] : null;
          const sectionData = practiceQuestions.sections.find(s => s.section_id === section.section_id);
          const isPracticePerfect = practiceScore && sectionData && practiceScore.correct >= sectionData.questions.length;
          
          return (
            <Link
              key={section.section_id}
              href={`/section/${section.section_id}`}
              className="card group hover:border-indigo-300 border-2 border-transparent fade-in"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{['📐', '🔑', '✏️', '📈', '⭕', '🔵'][index]}</span>
                {isCompleted && (
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">
                    ✓ Complete
                  </span>
                )}
              </div>
              <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-600 transition-colors mb-1">
                {section.section_id}. {section.title}
              </h3>
              <p className="text-gray-500 text-sm mb-3">{section.subtitle}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(section.difficulty)}`}>
                  {section.difficulty}
                </span>
                <span className="text-xs text-gray-400">⏱️ {section.estimated_time}</span>
              </div>
              {practiceScore && (
                <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                  Practice: <span className={`font-semibold ${isPracticePerfect ? 'text-green-600' : 'text-indigo-600'}`}>
                    {practiceScore.correct}/{practiceScore.total}
                    {isPracticePerfect && ' ✓'}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Tests Section */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 Unit Tests</h2>
      {mounted && !testsUnlocked && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 fade-in">
          <p className="text-amber-700 text-sm font-medium">
            🔒 Tests unlock when you get a perfect score on all {totalSections} section practice sets.
            <span className="ml-2 text-amber-600">({perfectPracticeSections}/{totalSections} complete)</span>
          </p>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {[1, 2].map((testNum) => {
          const testScore = mounted ? progress.testScores[testNum.toString()] : null;
          return (
            <Link
              key={testNum}
              href={`/test/${testNum}`}
              className={`card group border-2 border-transparent fade-in ${
                mounted && testsUnlocked
                  ? 'hover:border-purple-300'
                  : 'opacity-60 pointer-events-none'
              }`}
              style={{ animationDelay: `${0.4 + testNum * 0.05}s` }}
              aria-disabled={mounted && !testsUnlocked}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{mounted && testsUnlocked ? '📝' : '🔒'}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
                    Test {testNum}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    20 questions {mounted && !testsUnlocked && '• Complete all practice first'}
                  </p>
                  {testScore !== null && testScore !== undefined && (
                    <p className="text-sm mt-1">
                      Best Score: <span className="font-bold text-green-600">{testScore}/20</span>
                    </p>
                  )}
                </div>
                <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Prerequisites */}
      <div className="card fade-in" style={{ animationDelay: '0.5s' }}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">✅ What You Should Know</h2>
        <ul className="grid md:grid-cols-2 gap-2">
          {metadata.prerequisites.map((prereq, i) => (
            <li key={i} className="flex items-center gap-2 text-gray-600">
              <span className="text-green-500">✓</span> {prereq}
            </li>
          ))}
        </ul>
      </div>

      {/* Learning Objectives */}
      <div className="card mt-4 fade-in" style={{ animationDelay: '0.6s' }}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 What You Will Learn</h2>
        <ul className="grid md:grid-cols-2 gap-2">
          {metadata.learning_objectives.map((obj, i) => (
            <li key={i} className="flex items-center gap-2 text-gray-600">
              <span className="text-indigo-500">•</span> {obj}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
