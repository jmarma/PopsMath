'use client';

import { useMemo } from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
}

// Renders text with inline math expressions wrapped in \(...\)
// Uses \(...\) instead of $...$ to avoid conflicts with currency dollar signs
export default function MathText({ text, className = '' }: MathTextProps) {
  const rendered = useMemo(() => {
    // Split on \(...\) patterns for inline math
    const parts = text.split(/(\\\(.*?\\\))/g);
    return parts.map((part) => {
      if (part.startsWith('\\(') && part.endsWith('\\)')) {
        const math = part.slice(2, -2);
        try {
          const html = katex.renderToString(math, {
            throwOnError: false,
            displayMode: false,
          });
          return html;
        } catch {
          return part;
        }
      }
      // Escape HTML in non-math parts
      return part
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }).join('');
  }, [text]);

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}
