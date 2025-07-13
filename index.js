// index.js

// Initialize production check
const isProduction = 
  typeof process !== 'undefined' && 
  process.env && 
  process.env.NODE_ENV === 'production';

// Safely access Vite env
const getViteEnv = () => {
  try {
    return typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
  } catch {
    return {};
  }
};

// Resolve developer ID
const resolveDevId = () => {
  const viteEnv = getViteEnv();

  // Priority: Vite -> process.env -> CRA
  return (
    viteEnv.VITE_DEV_ID || 
    (typeof process !== 'undefined' && process.env?.DEV_ID) || 
    process.env?.REACT_APP_DEV_ID || 
    null
  );
};

// Initialize current Dev ID
let currentDevId = isProduction ? null : resolveDevId();

// Check browser environment
const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

// Try to get Dev ID from localStorage if not set
if (isBrowser && !isProduction) {
  if (!currentDevId) {
    currentDevId = localStorage.getItem('dev-id');
  } else {
    localStorage.setItem('dev-id', currentDevId);
  }
}

// Core API Functions
const setDevId = (id) => {
  if (isProduction) return;
  currentDevId = id;
  if (isBrowser) {
    localStorage.setItem('dev-id', id);
  }
};

const getDevId = () => currentDevId;

const shouldDebug = (targetDevId) => {
  if (isProduction || !currentDevId) return false;
  return targetDevId ? currentDevId === targetDevId : true;
};

const triggerDebugger = () => {
  if (shouldDebug()) {
    debugger;
  }
};

// Create logger instance for a specific Dev ID
const createDevLogger = (loggerDevId) => {
  if (isProduction) {
    return {
      log: () => {},
      warn: () => {},
      error: () => {},
      debug: () => {}
    };
  }

  const formatMessage = (type, args) => {
    const timestamp = new Date().toISOString().slice(11, 23);
    return [`[${loggerDevId}] [${timestamp}]`, ...args];
  };

  return {
    log: (...args) => {
      if (currentDevId !== loggerDevId) return;
      console.log(...formatMessage('log', args));
    },
    warn: (...args) => {
      if (currentDevId !== loggerDevId) return;
      console.warn(...formatMessage('warn', args));
    },
    error: (...args) => {
      if (currentDevId !== loggerDevId) return;
      console.error(...formatMessage('error', args));
    },
    debug: (...args) => {
      if (currentDevId !== loggerDevId) return;
      const message = formatMessage('debug', args);
      try {
        console.groupCollapsed(...message);
        console.trace();
        console.groupEnd();
      } catch {
        console.log(...message);
        console.trace();
      }
    }
  };
};

// Default logger instance
const defaultLogger = createDevLogger(currentDevId);

// Export public API
export {
  setDevId,
  getDevId,
  shouldDebug,
  createDevLogger,
  triggerDebugger
};

export const log = defaultLogger.log;
export const warn = defaultLogger.warn;
export const error = defaultLogger.error;
export const debug = defaultLogger.debug;
