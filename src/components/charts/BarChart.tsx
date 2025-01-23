"use client";

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: Array<{
    path: string;
    count: number;
  }>;
}

export function BarChart({ data }: BarChartProps) {
  const chartData = {
    labels: data.map(item => item.path),
    datasets: [
      {
        label: 'Page Views',
        data: data.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Page Views by Path'
      }
    }
  };

  return <Bar data={chartData} options={options} />;
} 