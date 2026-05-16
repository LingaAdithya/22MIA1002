# Stage 1

# Campus Notification Platform - System Design

## Overview

The Campus Notification Platform is designed to deliver real-time notifications to students regarding:

- Placements
- Events
- Results

The platform supports:
- Real-time notification delivery
- Notification filtering
- Read/unread tracking
- Priority notifications
- Notification history
- Scalable notification broadcasting

---

# Functional Requirements

1. Students should receive notifications in real-time.
2. Notifications should support categories:
   - Placement
   - Event
   - Result
3. Users should be able to:
   - Fetch notifications
   - Mark notifications as read
   - Filter notifications
4. The system should support bulk notification delivery.
5. Notifications should persist for historical access.

---

# Non Functional Requirements

- High availability
- Scalability
- Low latency
- Fault tolerance
- Observability through centralized logging
- Secure API communication
- Maintainable API contracts

---

# High Level Architecture

```text
Client Application
       |
       v
API Gateway / Backend Service
       |
       +-------------------+
       |                   |
       v                   v
Notification Service     Logging Middleware
       |
       v
Database
       |
       v
Realtime Delivery Layer (WebSocket)
```

---

# Notification Object Schema

```json
{
  "id": "uuid",
  "title": "Placement Opportunity",
  "message": "Company XYZ is hiring for SDE roles",
  "type": "Placement",
  "isRead": false,
  "priority": 1,
  "createdAt": "2026-05-16T10:00:00Z"
}
```

---

# REST API Design

## Base URL

```text
/api/v1
```

---

# 1. Fetch Notifications

## Endpoint

```http
GET /api/v1/notifications
```

## Headers

```json
{
  "Content-Type": "application/json"
}
```

## Query Parameters

| Parameter | Type | Description |
|---|---|---|
| page | number | Current page |
| limit | number | Records per page |
| type | string | Filter by notification type |
| isRead | boolean | Read status filter |

---

## Sample Request

```http
GET /api/v1/notifications?page=1&limit=10&type=Placement
```

---

## Sample Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Placement Opportunity",
      "message": "Company XYZ is hiring",
      "type": "Placement",
      "isRead": false,
      "createdAt": "2026-05-16T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

---

# 2. Mark Notification as Read

## Endpoint

```http
PATCH /api/v1/notifications/:id/read
```

---

## Sample Response

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

# 3. Create Notification

## Endpoint

```http
POST /api/v1/notifications
```

---

## Request Body

```json
{
  "title": "Placement Update",
  "message": "Interview scheduled tomorrow",
  "type": "Placement"
}
```

---

## Response

```json
{
  "success": true,
  "message": "Notification created successfully"
}
```

---

# Real-Time Notification Mechanism

The platform uses WebSockets for real-time notification delivery.

## Why WebSockets?

- Persistent bi-directional communication
- Lower latency than polling
- Reduced server overhead
- Instant notification delivery

## Realtime Flow

```text
Backend Service
      |
      v
WebSocket Server
      |
      v
Connected Clients
```

---

# Logging Middleware Integration

Every critical operation is logged using the reusable logging middleware.

## Example Log Calls

```ts
await Log(
  "backend",
  "info",
  "notification-service",
  "Notification created successfully"
);
```

```ts
await Log(
  "backend",
  "error",
  "notification-controller",
  "Failed to fetch notifications"
);
```

---

# Error Handling Strategy

Standardized error responses are used across all APIs.

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Something went wrong"
  }
}
```

---

# Future Enhancements

- Push notifications
- Email notifications
- Notification prioritization
- Distributed queue processing
- Redis caching
- Analytics dashboard