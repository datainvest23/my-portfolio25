"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

interface InterestButtonProps {
  projectId: string;
  className?: string;
}

export function InterestButton({ projectId, className = '' }: InterestButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/interested', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      });

      if (!response.ok) {
        throw new Error('Failed to register interest');
      }

      toast.success('Thanks for your interest!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to register interest');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? 'Processing...' : 'Interested?'}
    </Button>
  );
} 