# Queue Cure '26 - Live Sync Architecture

This document maps out the WebSocket events used in the application to ensure that both the Receptionist and Patient screens stay in perfect synchronization without any manual polling.

## Socket Event Diagram

```mermaid
sequenceDiagram
    participant P as Patient Screen (Mobile)
    participant API as Next.js API (Serverless)
    participant S as Socket.io Server
    participant R as Receptionist Screen (Web)

    Note over P, R: Event: Patient joins queue via QR Code
    P->>API: POST /api/queue/add
    API->>Database: INSERT into tokens
    API->>S: global.io.emit('queueUpdated')
    S-->>P: broadcast('queueUpdated')
    S-->>R: broadcast('queueUpdated')
    R->>API: fetch('/api/queue/next') (Auto-Refresh)
    P->>API: fetch('/api/tokens/status') (Auto-Refresh)
    
    Note over P, R: Event: Receptionist calls next token
    R->>API: POST /api/queue/next
    API->>Database: UPDATE tokens (Atomic lock)
    API->>S: global.io.emit('queueUpdated')
    S-->>P: broadcast('queueUpdated')
    S-->>R: broadcast('queueUpdated')
    R->>API: fetch('/api/queue/next') (Auto-Refresh)
    P->>API: fetch('/api/tokens/status') (Auto-Refresh)
    Note right of P: Patient's phone speaks announcement!
```

## Description of Events
- **`queueUpdated`**: The single source of truth broadcast event. When emitted by the backend, any connected client will re-fetch their respective state. This prevents data payload bloat over web sockets, using the socket strictly as a low-latency trigger, while relying on secure REST APIs to deliver the actual state.
