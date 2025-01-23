"use client";

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: Array<{
    date: string;
    count: number;
  }>;
}

export function LineChart({ data }: LineChartProps) {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Visits',
        data: data.map(item => item.count),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
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
        text: 'Daily Visits'
      }
    }
  };

  return <Line data={chartData} options={options} />;
} 