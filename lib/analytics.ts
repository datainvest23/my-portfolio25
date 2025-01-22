import { Logger } from './logger';

type AnalyticsData = {
  totalVisits: number;
  uniqueUsers: number;
  pathAnalytics: {
    [path: string]: number;
  };
  timeAnalytics: {
    hourly: { [hour: string]: number };
    daily: { [date: string]: number };
    monthly: { [month: string]: number };
  };
  userEngagement: {
    email: string;
    visitCount: number;
    lastVisit: string;
    mostVisitedPaths: { path: string; count: number }[];
  }[];
};

export class Analytics {
  static analyzeData(): AnalyticsData {
    const logs = Logger.getLogs();
    
    // Basic metrics
    const totalVisits = logs.length;
    const uniqueUsers = new Set(logs.map(log => log.email)).size;

    // Path analytics
    const pathAnalytics = logs.reduce((acc, log) => {
      acc[log.path] = (acc[log.path] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Time-based analytics
    const timeAnalytics = {
      hourly: {} as { [key: string]: number },
      daily: {} as { [key: string]: number },
      monthly: {} as { [key: string]: number },
    };

    logs.forEach(log => {
      const date = new Date(log.timestamp);
      const hour = date.getHours();
      const day = date.toISOString().split('T')[0];
      const month = day.substring(0, 7);

      timeAnalytics.hourly[hour] = (timeAnalytics.hourly[hour] || 0) + 1;
      timeAnalytics.daily[day] = (timeAnalytics.daily[day] || 0) + 1;
      timeAnalytics.monthly[month] = (timeAnalytics.monthly[month] || 0) + 1;
    });

    // User engagement analytics
    const userEngagement = Array.from(new Set(logs.map(log => log.email))).map(email => {
      const userLogs = logs.filter(log => log.email === email);
      const pathCounts = userLogs.reduce((acc, log) => {
        acc[log.path] = (acc[log.path] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const mostVisitedPaths = Object.entries(pathCounts)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      return {
        email,
        visitCount: userLogs.length,
        lastVisit: userLogs[userLogs.length - 1].timestamp,
        mostVisitedPaths,
      };
    });

    return {
      totalVisits,
      uniqueUsers,
      pathAnalytics,
      timeAnalytics,
      userEngagement,
    };
  }
} 