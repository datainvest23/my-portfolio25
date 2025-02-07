// src/lib/config.ts
export type FilterType =
  | 'ALL'
  | 'Featured'
  | 'Project'
  | 'Proposal'
  | 'Research'
  | 'Dashboard'
  | 'Strategy';

export const filterConfig: Record<FilterType, { label: string, bgColor: string, textColor: string, borderColor: string, hoverBg: string }> = {
  ALL: {
    label: 'All Projects',
    bgColor: 'bg-blue-50',  // Highlight ALL when active
    textColor: 'text-blue-900',
    borderColor: 'border-blue-900',
    hoverBg: 'hover:bg-blue-100'
  },
  Featured: {
    label: 'Featured',
    bgColor: 'bg-blue-50',  // Highlight ALL when active
    textColor: 'text-blue-900',
    borderColor: 'border-blue-900',
    hoverBg: 'hover:bg-blue-100'
  },
  Project: {
    label: 'Project',
    bgColor: 'bg-white',
    textColor: 'text-gray-900',
    borderColor: 'border-gray-900',
    hoverBg: 'hover:bg-gray-50'
  },
  Proposal: {
    label: 'Proposal',
    bgColor: 'bg-white',
    textColor: 'text-gray-900',
    borderColor: 'border-gray-900',
    hoverBg: 'hover:bg-gray-50'
  },
  Research: {
    label: 'Research',
    bgColor: 'bg-white',
    textColor: 'text-gray-900',
    borderColor: 'border-gray-900',
    hoverBg: 'hover:bg-gray-50'
  },
  Dashboard: {
    label: 'Dashboard',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-900',
    borderColor: 'border-amber-900',
    hoverBg: 'hover:bg-amber-100'
  },
  Strategy: {
    label: 'Strategy',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-900',
    borderColor: 'border-emerald-900',
    hoverBg: 'hover:bg-emerald-100'
  }
} as const;