type LogEntry = {
  timestamp: string;
  email: string;
  passkey: string;
  path: string;
};

export class Logger {
  private static logFile: LogEntry[] = [];

  static async logAccess(email: string, passkey: string, path: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      email,
      passkey,
      path,
    };

    this.logFile.push(entry);
    
    // You can also implement persistent storage here
    // For example, writing to a database or file
    console.log('Access logged:', entry);

    try {
      // Example: Send to your API endpoint
      await fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to store log:', error);
    }
  }

  static getLogs(): LogEntry[] {
    return this.logFile;
  }
} 