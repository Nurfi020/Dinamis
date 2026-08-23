const DEVICE_ID_KEY = 'kelola_lead_device_id_v1';

export interface DeviceMetadata {
  deviceId: string;
  deviceName: string;
  browser: string;
  operatingSystem: string;
}

/**
 * Get or generate a persistent unique Device ID
 */
export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') {
    return 'server-device-id';
  }

  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    // Generate UUIDv4 compliant random ID
    id = 'dev_' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

/**
 * Detect user agent browser & operating system
 */
export function getClientDeviceMetadata(): DeviceMetadata {
  const deviceId = getOrCreateDeviceId();
  
  if (typeof window === 'undefined') {
    return {
      deviceId,
      deviceName: 'Unknown Device',
      browser: 'Unknown Browser',
      operatingSystem: 'Unknown OS',
    };
  }

  const userAgent = navigator.userAgent || '';
  
  // Detect OS
  let operatingSystem = 'Unknown OS';
  if (/Windows NT 10.0/i.test(userAgent)) operatingSystem = 'Windows 10/11';
  else if (/Windows/i.test(userAgent)) operatingSystem = 'Windows';
  else if (/Macintosh|Mac OS X/i.test(userAgent)) operatingSystem = 'macOS';
  else if (/Android/i.test(userAgent)) operatingSystem = 'Android';
  else if (/iPhone|iPad|iPod/i.test(userAgent)) operatingSystem = 'iOS';
  else if (/Linux/i.test(userAgent)) operatingSystem = 'Linux';

  // Detect Browser
  let browser = 'Browser';
  if (/Edg\//i.test(userAgent)) browser = 'Microsoft Edge';
  else if (/Chrome\//i.test(userAgent) && !/Edg\//i.test(userAgent)) browser = 'Google Chrome';
  else if (/Safari\//i.test(userAgent) && !/Chrome\//i.test(userAgent)) browser = 'Apple Safari';
  else if (/Firefox\//i.test(userAgent)) browser = 'Mozilla Firefox';
  else if (/Opera|OPR\//i.test(userAgent)) browser = 'Opera';

  const deviceName = `${operatingSystem} (${browser})`;

  return {
    deviceId,
    deviceName,
    browser,
    operatingSystem,
  };
}
