# Queue Cure '26 - Thought Process & Architecture Decisions

## 1. Tech Stack Deviation Justification
**Requirement:** Express.js + MongoDB  
**Our Choice:** Next.js (Serverless API) + PostgreSQL (Neon)

**Why did we deviate from the recommended stack?**
While Express and MongoDB are excellent for rapid prototyping, a live healthcare queue management system faces two critical challenges that NoSQL and traditional monolithic Express apps struggle with:

1. **Concurrency and Race Conditions (The "Double Token" Problem):** 
   If two receptionists click "Call Next" at the exact same millisecond, a standard NoSQL lookup-then-update can result in both receptionists calling the *same* patient simultaneously. 
   **Solution:** We chose PostgreSQL because it supports ACID-compliant row-level locking. We implemented an atomic CTE query using `FOR UPDATE SKIP LOCKED`. This guarantees at the database level that no two concurrent requests can ever fetch the same waiting token.

2. **Zero-Maintenance Scalability:**
   Next.js API routes deployed to serverless environments auto-scale infinitely. A clinic owner doesn't need to manage an Express process using PM2 or deal with server crashes. 

## 2. Real-Time Sync Strategy
We implemented **Socket.io** for live bidirectional communication. 
- When a receptionist clicks "Call Next", the API updates the database atomically and emits a `queueUpdated` broadcast.
- When a patient joins via a QR code, the API creates their token and emits a `queueUpdated` broadcast.
- **Both the Receptionist and Patient screens listen to this event.** This ensures that the instant an action happens, all screens in the clinic update seamlessly without polling the database constantly, saving bandwidth and database read costs.

## 3. Dynamic Wait Time Calculation
Instead of a static number, the system calculates estimated wait times using a live multiplier: `(Tokens Ahead) × (Average Consultation Time)`. 
To make this realistic, we added a settings panel in the Receptionist Dashboard that allows the clinic to dynamically adjust their `Average Consultation Time` throughout the day (e.g., changing it from 15 minutes to 20 minutes if cases are complex). This instantly cascades to all patients' devices, updating their estimated wait.

## 4. Handling Edge Cases & Robustness
To ensure a mistake-proof and resilient system, we implemented solutions for the following critical edge cases:

1. **Patient closing/reopening the tab:** 
   The patient's token is saved persistently using Zustand's local storage middleware (`useAppStore.js`). If a patient accidentally closes their browser tab or restarts their phone, navigating back to the app immediately restores their active token session.

2. **Network drop & reconnect handling:**
   If the WebSocket connection drops (e.g., walking into an elevator), Socket.io automatically attempts to reconnect. Upon successful reconnection, the client automatically triggers a fresh `fetch` to `/api/tokens/status` to ensure no events were missed during the downtime. We also provided manual "Refresh" buttons that are rate-limited to prevent API spam.

3. **What happens at Token 0 (Empty Queue):**
   The database gracefully handles an empty queue by returning a 404/Empty state. The frontend prevents errors by disabling the "Call Next" button if `waiting === 0` and displays a clear "Queue is Empty" skeleton/illustration state to the receptionist to prevent double-submits or confusion.

4. **Double-Submit Prevention:**
   All buttons (Generate Token, Call Next, Add Patient) immediately disable and show a loading spinner upon click, preventing users with slow network connections from accidentally generating duplicate tokens.
