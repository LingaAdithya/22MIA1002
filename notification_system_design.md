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

---

# Stage 2

# Persistent Storage Design

## Database Choice

The recommended database for the notification platform is PostgreSQL.

## Why PostgreSQL?

PostgreSQL was selected because it provides:

- Strong ACID compliance
- High reliability
- Efficient indexing
- Excellent query optimization
- Scalability support
- Strong support for relational data
- Efficient pagination and filtering
- JSON support for future extensibility

The notification platform requires:
- Reliable storage
- Fast querying
- Read/unread tracking
- Filtering by notification type
- Historical notification access

PostgreSQL handles these requirements efficiently.

---

# Database Schema

## Students Table

```sql
CREATE TABLE students (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Notifications Table

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    title VARCHAR(255),
    message TEXT,
    notification_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# Recommended Indexes

```sql
CREATE INDEX idx_notifications_student_id
ON notifications(student_id);

CREATE INDEX idx_notifications_is_read
ON notifications(is_read);

CREATE INDEX idx_notifications_type
ON notifications(notification_type);

CREATE INDEX idx_notifications_created_at
ON notifications(created_at DESC);
```

---

# Notification Fetch Query

## Fetch unread notifications

```sql
SELECT id, title, message, notification_type, created_at
FROM notifications
WHERE student_id = 'student-uuid'
AND is_read = FALSE
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;
```

---

# Mark Notification As Read

```sql
UPDATE notifications
SET is_read = TRUE
WHERE id = 'notification-uuid';
```

---

# Create Notification

```sql
INSERT INTO notifications (
    id,
    student_id,
    title,
    message,
    notification_type
)
VALUES (
    gen_random_uuid(),
    'student-uuid',
    'Placement Opportunity',
    'Company XYZ is hiring',
    'Placement'
);
```

---

# Scalability Challenges

As the platform grows, the following problems may occur:

1. Large notification table growth
2. Slow read queries
3. Increased database load
4. High concurrent notification delivery
5. Expensive pagination queries
6. Increased storage requirements

---

# Scalability Improvements

## 1. Pagination

Use pagination to avoid loading large datasets.

```http
GET /notifications?page=1&limit=10
```

---

## 2. Indexing

Indexes improve:
- filtering speed
- sorting performance
- read latency

---

## 3. Partitioning

Notifications can be partitioned:
- by student_id
- by month/year
- by notification type

This reduces query scan size.

---

## 4. Redis Caching

Frequently accessed notifications can be cached using Redis.

Benefits:
- reduced DB load
- lower latency
- improved scalability

---

## 5. Archival Strategy

Older notifications can be archived into cold storage tables.

This keeps the primary notification table lightweight.

---

# API and DB Consistency

The database schema directly aligns with the REST API contract defined in Stage 1.

Benefits:
- predictable API responses
- maintainable backend structure
- simplified query optimization
- easier frontend integration

---

# Logging Integration

All database operations are logged using the reusable logging middleware.

## Example

```ts
await Log(
  "backend",
  "info",
  "notification-repository",
  "Fetched unread notifications"
);
```

```ts
await Log(
  "backend",
  "error",
  "notification-repository",
  "Database query failed while fetching notifications"
);
```

---

# Stage 3

# Query Optimization and Computational Efficiency

As the notification platform scales to thousands or millions of notifications, query optimization becomes critical for maintaining low latency and system responsiveness.

The primary optimization goals are:

- Reduce database scan cost
- Minimize response latency
- Improve pagination performance
- Optimize sorting operations
- Reduce unnecessary data transfer
- Improve concurrent read efficiency

---

# Common Performance Bottlenecks

Potential bottlenecks include:

1. Full table scans
2. Expensive sorting operations
3. Large OFFSET pagination
4. Repeated unread notification queries
5. Excessive database round trips
6. Fetching unnecessary columns
7. High concurrent access

---

# Query Optimization Strategies

## 1. Avoid SELECT *

Bad Practice:

```sql
SELECT *
FROM notifications;
```

Problem:
- unnecessary data transfer
- increased memory usage
- slower query execution

Optimized Query:

```sql
SELECT id, title, message, notification_type, created_at
FROM notifications;
```

Benefits:
- reduced payload size
- improved execution speed
- lower memory consumption

---

# 2. Composite Indexing

Frequently used filters should use composite indexes.

## Recommended Composite Index

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(student_id, is_read, created_at DESC);
```

Benefits:
- faster filtering
- optimized sorting
- reduced scan cost

This index supports queries such as:

```sql
SELECT id, title, message
FROM notifications
WHERE student_id = 'student-uuid'
AND is_read = FALSE
ORDER BY created_at DESC
LIMIT 10;
```

---

# 3. Efficient Pagination Strategy

OFFSET-based pagination becomes expensive at large scale.

Problematic Query:

```sql
SELECT *
FROM notifications
ORDER BY created_at DESC
LIMIT 10 OFFSET 100000;
```

Problem:
- database scans large numbers of rows
- increasing latency

---

# Cursor-Based Pagination

Recommended Approach:

```sql
SELECT id, title, message, created_at
FROM notifications
WHERE created_at < '2026-05-16T10:00:00Z'
ORDER BY created_at DESC
LIMIT 10;
```

Benefits:
- lower computational cost
- scalable pagination
- improved response time

---

# 4. Query Result Caching

Frequently requested notification lists can be cached using Redis.

## Cache Example

```text
notifications:student_id:unread
```

Benefits:
- reduced DB load
- faster response time
- improved scalability

---

# 5. Database Connection Pooling

Connection pooling improves concurrent database performance.

Benefits:
- reduced connection overhead
- improved throughput
- better resource utilization

Recommended libraries:
- pg-pool
- Prisma pooling
- Sequelize pooling

---

# 6. Read Optimization

The system prioritizes read efficiency because notification systems are typically read-heavy.

Optimizations include:
- indexed queries
- caching
- lightweight response payloads
- optimized pagination

---

# 7. Batch Notification Inserts

Instead of inserting notifications one-by-one:

Bad Practice:

```sql
INSERT INTO notifications VALUES (...);
INSERT INTO notifications VALUES (...);
INSERT INTO notifications VALUES (...);
```

Optimized Batch Insert:

```sql
INSERT INTO notifications (
    id,
    student_id,
    title,
    message,
    notification_type
)
VALUES
(...),
(...),
(...);
```

Benefits:
- fewer DB round trips
- improved write throughput
- reduced latency

---

# 8. Asynchronous Processing

Heavy notification processing should be asynchronous.

Examples:
- email notifications
- push notifications
- analytics updates

Benefits:
- reduced API response time
- improved user experience
- better scalability

---

# Estimated Computational Improvements

| Optimization | Improvement |
|---|---|
| Composite indexing | Faster filtering and sorting |
| Cursor pagination | Reduced scan complexity |
| Redis caching | Lower DB load |
| Batch inserts | Higher write throughput |
| Async processing | Lower request latency |

---

# Logging and Monitoring

All expensive queries and optimization events are logged.

## Example

```ts
await Log(
  "backend",
  "info",
  "notification-query-service",
  "Optimized notification query executed successfully"
);
```

```ts
await Log(
  "backend",
  "warn",
  "notification-query-service",
  "High latency detected for notification retrieval"
);
```

---

# Future Optimization Opportunities

Future improvements may include:

- Read replicas
- Materialized views
- Query prefetching
- CDN-backed notification assets
- Distributed caching
- Event-driven architectures

These optimizations improve long-term scalability and reliability.