<<<<<<< HEAD
export type FilterType = 'ALL' | 'WEB' | 'MOBILE' | 'AI' | 'OTHER'
=======
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
>>>>>>> 997e0693bb39e8a6f5bf00e575adaeff1de1c18b

export const filterConfig = {
  ALL: {
    label: 'All Projects',
    bgColor: 'bg-neutral-100',
    textColor: 'text-neutral-900',
    borderColor: 'border-neutral-200'
  },
  WEB: {
    label: 'Web Apps',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-900',
    borderColor: 'border-blue-200'
  },
  MOBILE: {
    label: 'Mobile Apps',
    bgColor: 'bg-green-100',
    textColor: 'text-green-900',
    borderColor: 'border-green-200'
  },
  AI: {
    label: 'AI Projects',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-900',
    borderColor: 'border-purple-200'
  },
  OTHER: {
    label: 'Other',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-900',
    borderColor: 'border-gray-200'
  }
} as const; 