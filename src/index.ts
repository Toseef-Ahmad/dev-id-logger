// index.cjs
let devId = null;

/**
 * Safely resolves the current dev ID from multiple sources
 * @returns {string|null} The current dev ID or null
 */
function resolveDevId() {
  try {
    // Check in-memory first
    if (devId) return devId;
    
    // Browser environment checks
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const stored = localStorage.getItem("dev-id");
      if (stored) return stored;
    }
    
    // Node.js environment variables
    if (typeof process !== "undefined" && process.env) {
      return (
        process.env.DEV_ID ||
        process.env.REACT_APP_DEV_ID ||
        process.env.VITE_DEV_ID ||
        process.env.NEXT_PUBLIC_DEV_ID ||
        null
      );
    }
    
    return null;
  } catch (error) {
    // Silently fail and return null if any error occurs
    return null;
  }
}

/**
 * Sets the dev ID for current session
 * @param {string} id - The developer ID to set
 */
function setDevId(id) {
  if (typeof id !== "string") {
    console.warn("[dev-id-logger] Dev ID must be a string");
    return;
  }
  
  devId = id;
  
  // Try to persist to localStorage if available
  try {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem("dev-id", id);
    }
  } catch (error) {
    // Silently fail if localStorage is not available or throws
  }
}

/**
 * Gets the current dev ID
 * @returns {string|null} The current dev ID or null
 */
function getDevId() {
  return resolveDevId();
}

/**
 * Checks if debugging should be enabled for the given owner
 * @param {string|null} ownerId - The owner ID to check against
 * @returns {boolean} Whether debugging should be enabled
 */
function shouldDebug(ownerId = null) {
  const currentId = resolveDevId();
  if (!currentId) return false;
  return !ownerId || currentId === ownerId;
}

/**
 * Safely formats stack trace
 * @returns {string} Formatted stack trace or fallback message
 */
function formatStack() {
  try {
    const err = new Error();
    if (err.stack) {
      const stack = err.stack.split("\n").slice(3).join("\n");
      return stack || "[no stack trace available]";
    }
    return "[no stack trace available]";
  } catch (e) {
    return "[stack trace unavailable]";
  }
}

/**
 * Creates a scoped logger for a specific developer
 * @param {string|null} ownerId - The owner ID for this logger
 * @returns {Object} Logger object with log, warn, error, debug, and triggerDebugger methods
 */
function createDevLogger(ownerId = null) {
  const currentId = resolveDevId();
  
  function scopedCheck() {
    return shouldDebug(ownerId || currentId);
  }
  
  return {
    log: (...args) => {
      if (scopedCheck()) {
        console.log("🪵 [DEV-LOG]", ...args);
      }
    },
    warn: (...args) => {
      if (scopedCheck()) {
        console.warn("⚠️ [DEV-WARN]", ...args);
      }
    },
    error: (...args) => {
      if (scopedCheck()) {
        console.error("❌ [DEV-ERROR]", ...args);
      }
    },
    debug: (...args) => {
      if (scopedCheck()) {
        console.info("🧠 [DEV-DEBUG]", ...args.length ? args : "Paused");
        console.info("📍 Debug called from:", formatStack());
      }
    },
    triggerDebugger: () => {
      if (scopedCheck()) {
        // Use try-catch to prevent debugger from breaking in production
        try {
          debugger;
        } catch (e) {
          console.info("🔧 [DEV-DEBUGGER] Debugger not available in this environment");
        }
      }
    }
  };
}

// Default scoped logger (auto-owner = current dev)
const defaultLogger = createDevLogger();

// Export for CommonJS
module.exports = {
  setDevId,
  getDevId,
  shouldDebug,
  createDevLogger,
  log: defaultLogger.log,
  warn: defaultLogger.warn,
  error: defaultLogger.error,
  debug: defaultLogger.debug,
  triggerDebugger: defaultLogger.triggerDebugger
};

// Also support named exports pattern
module.exports.setDevId = setDevId;
module.exports.getDevId = getDevId;
module.exports.shouldDebug = shouldDebug;
module.exports.createDevLogger = createDevLogger;
module.exports.log = defaultLogger.log;
module.exports.warn = defaultLogger.warn;
module.exports.error = defaultLogger.error;
module.exports.debug = defaultLogger.debug;
module.exports.triggerDebugger = defaultLogger.triggerDebugger;
