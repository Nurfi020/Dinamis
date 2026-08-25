import { DevModeInfo } from '../types';

export class DevModeClient {
  /**
   * Check if Development Mode is officially active and valid on the current client & server
   */
  public static async checkStatus(): Promise<DevModeInfo> {
    if (typeof window === 'undefined') {
      return { isDevMode: false };
    }

    // 1. Client-side Hostname Sanity Check
    const hostname = window.location.hostname.toLowerCase();
    const isLocalhost = 
      hostname === 'localhost' || 
      hostname === '127.0.0.1' || 
      hostname === '[::1]';

    if (!isLocalhost) {
      return {
        isDevMode: false,
        host: hostname,
      };
    }

    // 2. Query Server-side Source of Truth
    try {
      const res = await fetch('/api/dev-mode/status', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store',
      });

      if (!res.ok) {
        return { isDevMode: false };
      }

      const data = await res.json();
      if (data && data.isDevMode) {
        return {
          isDevMode: true,
          startDate: data.startDate,
          expiresAt: data.expiresAt,
          remainingDays: data.remainingDays,
          environment: data.environment,
          host: data.host || hostname,
        };
      }

      return { isDevMode: false };
    } catch {
      return { isDevMode: false };
    }
  }
}