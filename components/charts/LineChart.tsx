"use client";

import { Line } from 'recharts';

interface LineChartProps {
  data: Array<{
    date: string;
    count: number;
  }>;
}

export function LineChart({ data }: LineChartProps) {
  return (
    <div className="line-chart">
      {/* Implement your chart here using your preferred charting library */}
    </div>
  );
} 