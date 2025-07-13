# dev-id-logger
<<<<<<< HEAD
Developer-scoped logging and debugging — powerful, clean console output only for your dev ID.
=======

> 🔒 Developer-scoped logging and debugging — powerful, clean console output only for your dev ID.

## 📦 About

`dev-id-logger` is a developer utility designed to help teams log and debug **only for themselves**, without spamming other team members' consoles. It enables per-developer visibility into logs, debugging, and conditional features.

Perfect for React, Vite, Next.js, or any frontend app.

---

## ❓ Why This Package Exists (A Real Team Problem)

Imagine a team of 3 developers:
- **Ali** is debugging a form bug.
- **Sara** is working on performance tuning.
- **Touseef** is building a new component.

Each of them wants to use `console.log`, `debugger`, and inspect some data locally.
But if everyone pushes their logs or works on the same branch:

❌ Logs get messy.  
❌ `debugger` pauses the app for others.  
❌ Nobody knows which logs belong to who.

### ✅ Solution:
With `dev-id-logger`, each log is **strictly scoped to the developer who wrote it**. When someone runs the app with their own Dev ID:
- They only see **their own logs**
- Other developers' logs are completely hidden
- `debugger` will only trigger for them

---

## 🚀 Features

✅ Strict Dev ID-based log filtering  
✅ Auto-tag logs with Dev ID and timestamp  
✅ Vite, CRA, and Node.js environment support  
✅ Zero production overhead (logs disabled)  
✅ Debug mode with stack traces  
✅ Conditional debugging helpers  

---

## 🔧 Installation

```bash
npm install dev-id-logger
```

---

## 🧑‍💻 Usage

### 1. 🌱 Set Dev ID via `.env` (Recommended)

Add your Dev ID to your project's `.env` file:

```env
# For Vite projects:
VITE_DEV_ID=your_id

# For Create React App:
REACT_APP_DEV_ID=your_id

# Generic Node projects:
DEV_ID=your_id
```

> The logger will automatically detect your ID at runtime.

---

### 2. Create Dedicated Loggers

```js
import { createDevLogger } from "dev-id-logger";

// Create personal loggers for each developer
const aliLogger = createDevLogger("ali");
const saraLogger = createDevLogger("sara");
const touseefLogger = createDevLogger("touseef");

// Each logger only outputs for its own Dev ID
aliLogger.log("Ali's debug message");   // Only Ali sees this
saraLogger.warn("Performance warning"); // Only Sara sees this
touseefLogger.debug("State trace");     // Only Touseef sees this (with stack)
```

---

### 3. Conditional Debugging

```js
import { shouldDebug } from "dev-id-logger";

// Only runs for the current developer
if (shouldDebug()) {
  console.log("Debug data:", data);
  debugger; // Pauses only for current Dev ID
}

// Check for specific developer
if (shouldDebug("touseef")) {
  // Debugging logic just for Touseef
}
```

---

### 4. Manual ID Management (Advanced)

```js
import { setDevId, getDevId } from "dev-id-logger";

// Set ID manually (persists in localStorage)
setDevId("touseef");

// Get current ID
console.log("Current Dev ID:", getDevId());
```

---

## 🛠 How It Works

### Resolution Priority:
1. `import.meta.env.VITE_DEV_ID` (Vite)
2. `process.env.VITE_DEV_ID` (SSR/Node)
3. `process.env.REACT_APP_DEV_ID` (CRA)
4. `localStorage['dev-id']` (browser fallback)

### Production Behavior:
```js
// In production builds:
createDevLogger("any_id").log("Test") // => No output
shouldDebug() // => Always false
```

---

## ✅ Real-World Example

**PaymentForm.jsx**
```jsx
import { createDevLogger, shouldDebug } from "dev-id-logger";
const paymentLogger = createDevLogger("touseef");

function PaymentForm() {
  paymentLogger.log("Rendered payment form"); // Only Touseef sees this
  
  if (shouldDebug("touseef")) {
    debugger; // Pauses only for Touseef
  }

  return <form>...</form>;
}
```

---

## 📘 API Reference

| Function               | Description                                       |
|------------------------|---------------------------------------------------|
| `createDevLogger(id)`  | Creates a logger that only works for specified ID |
| `shouldDebug(id?)`     | Returns true if current Dev ID matches            |
| `setDevId(id)`         | Manually set Dev ID (persists in localStorage)   |
| `getDevId()`           | Returns current Dev ID                           |

---

## 💡 Best Practices

1. **Use named loggers** for different components:
   ```js
   const formLogger = createDevLogger("touseef");
   formLogger.debug("Form state", state);
   ```

2. **Combine with feature flags**:
   ```js
   if (shouldDebug("touseef") && FEATURE_FLAG_NEW_CHECKOUT) {
     loadExperimentalCheckout();
   }
   ```

3. **Use debug() for troubleshooting**:
   ```js
   const logger = createDevLogger("touseef");
   logger.debug("API response", response); // Shows stack trace
   ```

---

## 📄 License

MIT — free to use and modify.

---

Made with ❤️ by Touseef Ahmad. Contributions welcome!
>>>>>>> bb186d5 (Commit to git)
