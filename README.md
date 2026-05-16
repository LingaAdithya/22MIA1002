# Logging Middleware

Reusable TypeScript logging middleware for frontend and backend applications.

## Features

- Structured logging
- Multiple log levels
- Remote logging support
- Reusable package architecture
- Type-safe implementation

## Usage

```ts
await Log(
  "backend",
  "info",
  "notification-service",
  "Notification dispatched successfully"
);
```