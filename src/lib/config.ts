export type FilterType = 'ALL' | 'SELECTED' | 'DASHBOARD' | 'STRATEGY';

export const filterConfig = {
  ALL: {
    label: 'All Projects',
    bgColor: 'bg-white',
    textColor: 'text-gray-900',
    borderColor: 'border-gray-900',
    hoverBg: 'hover:bg-gray-50'
  },
  SELECTED: {
    label: 'Selected',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-900',
    borderColor: 'border-blue-900',
    hoverBg: 'hover:bg-blue-100'
  },
  DASHBOARD: {
    label: 'Dashboard',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-900',
    borderColor: 'border-amber-900',
    hoverBg: 'hover:bg-amber-100'
  },
  STRATEGY: {
    label: 'Strategy',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-900',
    borderColor: 'border-emerald-900',
    hoverBg: 'hover:bg-emerald-100'
  }
} as const; 