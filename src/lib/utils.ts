<<<<<<< HEAD
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
=======
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]): string {
>>>>>>> 997e0693bb39e8a6f5bf00e575adaeff1de1c18b
  return twMerge(clsx(inputs))
} 