export type FilterType = 'ALL' | 'WEB' | 'MOBILE' | 'AI' | 'OTHER'

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