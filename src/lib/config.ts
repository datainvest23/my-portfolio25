export const filterConfig = {
  'ALL': {
    label: 'ALL',
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    borderColor: 'border-blue-600'
  },
  'PROJECT': {
    label: 'PROJECT',
    bgColor: 'bg-emerald-500',
    textColor: 'text-white',
    borderColor: 'border-emerald-600'
  },
  'PROPOSAL': {
    label: 'PROPOSAL',
    bgColor: 'bg-amber-500',
    textColor: 'text-white',
    borderColor: 'border-amber-600'
  },
  'RESEARCH': {
    label: 'RESEARCH',
    bgColor: 'bg-purple-500',
    textColor: 'text-white',
    borderColor: 'border-purple-600'
  },
  'DASHBOARD': {
    label: 'DASHBOARD',
    bgColor: 'bg-rose-500',
    textColor: 'text-white',
    borderColor: 'border-rose-600'
  }
} as const;

export type FilterType = keyof typeof filterConfig; 