"use client";

import React from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings?: TOCItem[]; // Made optional to prevent runtime errors
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  // Function to scroll smoothly to the heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Validate headings before rendering
  if (!headings || !Array.isArray(headings) || headings.length === 0) {
    return null; // Return null if headings are not valid
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">TABLE OF CONTENTS</h2>
      <nav className="max-h-[60vh] overflow-y-auto">
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{
                marginLeft: `${(heading.level - 1) * 1}rem`,
              }}
            >
              <button
                onClick={() => scrollToHeading(heading.id)}
                className="text-gray-600 hover:text-blue-600 hover:underline text-left w-full py-1 text-sm"
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
