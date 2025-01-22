export const filterConfig = {
  'ALL': {
    label: 'ALL',
    bgColor: 'bg-blue-50/80 hover:bg-blue-100/80',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200/50'
  },
  'PROJECT': {
    label: 'PROJECT',
    bgColor: 'bg-emerald-50/80 hover:bg-emerald-100/80',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200/50'
  },
  'PROPOSAL': {
    label: 'PROPOSAL',
    bgColor: 'bg-amber-50/80 hover:bg-amber-100/80',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200/50'
  },
  'RESEARCH': {
    label: 'RESEARCH',
    bgColor: 'bg-purple-50/80 hover:bg-purple-100/80',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200/50'
  },
  'DASHBOARD': {
    label: 'DASHBOARD',
    bgColor: 'bg-rose-50/80 hover:bg-rose-100/80',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200/50'
  }
} as const;

export type FilterType = keyof typeof filterConfig; 