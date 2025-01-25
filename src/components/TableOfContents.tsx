"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: TOCItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="table-of-contents">
      <h2 className="text-xl font-semibold mb-4">TABLE OF CONTENTS</h2>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li 
              key={heading.id}
              style={{ 
                marginLeft: `${(heading.level - 2) * 1}rem`,
              }}
            >
              <button
                onClick={() => scrollToHeading(heading.id)}
                className="text-gray-600 hover:text-gray-900 hover:underline text-left w-full"
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
} 