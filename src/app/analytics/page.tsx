"use client";

import { useEffect, useState } from 'react';
import { Analytics } from '@/lib/analytics';
import { LineChart, BarChart } from '@/components/charts';

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    const data = Analytics.analyzeData();
    setAnalyticsData(data);
  }, []);

  if (!analyticsData) return <div>Loading...</div>;

  return (
    <div className="analytics-dashboard">
      <h1 className="analytics-title">Analytics Dashboard</h1>
      
      {/* Overview Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Visits</h3>
          <p className="metric-value">{analyticsData.totalVisits}</p>
        </div>
        <div className="metric-card">
          <h3>Unique Users</h3>
          <p className="metric-value">{analyticsData.uniqueUsers}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Daily Visits</h3>
          <LineChart 
            data={Object.entries(analyticsData.timeAnalytics.daily)
              .map(([date, count]) => ({ date, count }))}
          />
        </div>
        <div className="chart-container">
          <h3>Popular Pages</h3>
          <BarChart 
            data={Object.entries(analyticsData.pathAnalytics)
              .map(([path, count]) => ({ path, count }))}
          />
        </div>
      </div>

      {/* User Engagement Table */}
      <div className="user-engagement">
        <h3>User Engagement</h3>
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Visit Count</th>
              <th>Last Visit</th>
              <th>Most Visited Pages</th>
            </tr>
          </thead>
          <tbody>
            {analyticsData.userEngagement.map((user: any) => (
              <tr key={user.email}>
                <td>{user.email}</td>
                <td>{user.visitCount}</td>
                <td>{new Date(user.lastVisit).toLocaleString()}</td>
                <td>
                  {user.mostVisitedPaths.map(({ path, count }: any) => (
                    <div key={path}>{path}: {count} visits</div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 