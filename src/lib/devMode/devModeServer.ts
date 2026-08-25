import fs from 'fs';
import path from 'path';

export interface DevModeStatus {
  isDevMode: boolean;
  startDate?: string;
  expiresAt?: string;
  remainingDays?: number;
  reason?: string;
  environment?: string;
  host?: string;
}

const DEV_STATE_FILE = path.join(process.cwd(), '.dev_mode_state.json');
const DEV_DURATION_DAYS = 30;
const DEV_DURATION_MS = DEV_DURATION_DAYS * 24 * 60 * 60 * 1000;

interface DevStateSchema {
  developmentStartDate: string;
  developmentExpiresAt: string;
  createdAt: string;
}

/**
 * Get or initialize persistent 30-day development mode state
 */
function getOrInitDevState(): DevStateSchema {
  try {
    if (fs.existsSync(DEV_STATE_FILE)) {
      const raw = fs.readFileSync(DEV_STATE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.developmentStartDate && parsed.developmentExpiresAt) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read dev mode state file:', e);
  }

  const now = new Date();
  const expires = new Date(now.getTime() + DEV_DURATION_MS);

  const state: DevStateSchema = {
    developmentStartDate: now.toISOString(),
    developmentExpiresAt: expires.toISOString(),
    createdAt: now.toISOString(),
  };

  try {
    fs.writeFileSync(DEV_STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Could not write dev mode state file:', e);
  }

  return state;
}

/**
 * Check if the current request qualifies strictly for Development Mode
 * 
 * Strict Criteria:
 * 1. NODE_ENV must strictly be 'development'. In production, ALWAYS false.
 * 2. Host header must strictly be localhost or 127.0.0.1.
 * 3. Server timestamp must be within the 30-day window from initial setup.
 */
export function checkServerDevMode(requestHost?: string | null): DevModeStatus {
  const isDevEnv = process.env.NODE_ENV === 'development';

  // 1. STRICT ENVIRONMENT CHECK: If in production, ALWAYS FALSE
  if (!isDevEnv || process.env.NODE_ENV === 'production') {
    return {
      isDevMode: false,
      reason: 'Environment is not development (NODE_ENV !== "development")',
    };
  }

  // 2. STRICT HOST CHECK: Must be localhost or 127.0.0.1
  const cleanHost = (requestHost || '').toLowerCase().trim();
  const hostWithoutPort = cleanHost.split(':')[0];

  const isLocalHost = 
    hostWithoutPort === 'localhost' || 
    hostWithoutPort === '127.0.0.1' ||
    hostWithoutPort === '::1';

  if (!isLocalHost) {
    return {
      isDevMode: false,
      reason: 'Host is not localhost or 127.0.0.1',
      host: cleanHost,
    };
  }

  // 3. STRICT 30-DAY PERSISTENCE CHECK (Server Timestamp)
  const state = getOrInitDevState();
  const now = Date.now();
  const expiresTimestamp = new Date(state.developmentExpiresAt).getTime();

  if (now > expiresTimestamp) {
    return {
      isDevMode: false,
      startDate: state.developmentStartDate,
      expiresAt: state.developmentExpiresAt,
      remainingDays: 0,
      reason: 'Development mode has expired after 30 days. Please use a regular license key.',
    };
  }

  const remainingMs = Math.max(0, expiresTimestamp - now);
  const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));

  return {
    isDevMode: true,
    startDate: state.developmentStartDate,
    expiresAt: state.developmentExpiresAt,
    remainingDays,
    environment: 'development',
    host: cleanHost,
  };
}