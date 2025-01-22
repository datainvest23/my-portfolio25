"use client";

import { Bar } from 'recharts';

interface BarChartProps {
  data: Array<{
    path: string;
    count: number;
  }>;
}

export function BarChart({ data }: BarChartProps) {
  return (
    <div className="bar-chart">
      {/* Implement your chart here using your preferred charting library */}
    </div>
  );
} 