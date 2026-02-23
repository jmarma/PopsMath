'use client';

import Link from 'next/link';
import { useState } from 'react';
import metadata from '@/data/metadata.json';

const unitNumber = metadata.unit_number;
const unitTitle = metadata.unit_title;
const sections = metadata.sections.map((s) => ({
  id: s.section_id,
  title: s.title,
}));

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🧮</span>
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Chloe&apos;s Math Lab
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              Home
            </Link>
            <div className="relative group">
              <button className="text-gray-600 hover:text-indigo-600 font-medium transition-colors flex items-center gap-1">
                Unit {unitNumber} <span className="text-xs">▼</span>
              </button>
              <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase border-b mb-1">
                  Unit {unitNumber}: {unitTitle}
                </div>
                {sections.map((s) => (
                  <Link
                    key={s.id}
                    href={`/section/${s.id}`}
                    className="block px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-sm"
                  >
                    <span className="font-semibold">{s.id}.</span> {s.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className="relative group">
              <button className="text-gray-600 hover:text-indigo-600 font-medium transition-colors flex items-center gap-1">
                Tests <span className="text-xs">▼</span>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2">
                <Link href="/test/1" className="block px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                  Test 1
                </Link>
                <Link href="/test/2" className="block px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                  Test 2
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <Link href="/" className="block py-2 text-gray-600 hover:text-indigo-600" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <div className="py-2">
              <span className="text-sm font-semibold text-gray-400 uppercase">Unit {unitNumber}: {unitTitle}</span>
              {sections.map((s) => (
                <Link
                  key={s.id}
                  href={`/section/${s.id}`}
                  className="block py-2 pl-4 text-gray-600 hover:text-indigo-600 text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="font-semibold">{s.id}.</span> {s.title}
                </Link>
              ))}
            </div>
            <div className="py-2">
              <span className="text-sm font-semibold text-gray-400 uppercase">Tests</span>
              <Link href="/test/1" className="block py-2 pl-4 text-gray-600 hover:text-indigo-600" onClick={() => setIsOpen(false)}>
                Test 1
              </Link>
              <Link href="/test/2" className="block py-2 pl-4 text-gray-600 hover:text-indigo-600" onClick={() => setIsOpen(false)}>
                Test 2
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
