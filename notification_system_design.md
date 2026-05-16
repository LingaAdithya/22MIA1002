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

---

# Stage 4

# Frontend Performance and Real-Time Optimization

The frontend application is designed using React with Material UI to provide a scalable, responsive, and real-time notification experience.

The primary frontend goals are:

- Real-time updates
- Fast rendering
- Low latency UI interactions
- Efficient state management
- Minimal unnecessary re-renders
- Responsive user experience

---

# Frontend Technology Stack

| Technology | Purpose |
|---|---|
| React | Component-based frontend architecture |
| TypeScript | Type safety and maintainability |
| Material UI | Consistent and responsive UI |
| WebSockets | Real-time notification delivery |
| Axios | API communication |

---

# Real-Time Notification Strategy

The frontend receives notifications through WebSocket connections.

## WebSocket Benefits

- Persistent connection
- Instant updates
- Lower latency
- Reduced polling overhead
- Efficient server-client communication

---

# WebSocket Event Flow

```text
Backend Notification Service
            |
            v
      WebSocket Server
            |
            v
      Connected Clients
            |
            v
React State Update + UI Re-render
```

---

# Frontend Rendering Challenges

Potential frontend bottlenecks include:

1. Frequent re-renders
2. Large notification lists
3. Expensive DOM updates
4. Repeated API calls
5. High memory consumption
6. Slow filtering operations

---

# Frontend Optimization Strategies

## 1. Component-Based Architecture

The UI is split into reusable components:

```text
App
 ├── NotificationList
 ├── NotificationCard
 ├── FilterPanel
 ├── Header
 └── PaginationControls
```

Benefits:
- maintainability
- isolated rendering
- improved scalability

---

# 2. Memoization

React.memo is used to prevent unnecessary component re-renders.

Example:

```tsx
export default React.memo(NotificationCard);
```

Benefits:
- reduced rendering cost
- improved UI responsiveness

---

# 3. useMemo Optimization

Filtering and sorting operations are memoized.

Example:

```tsx
const filteredNotifications = useMemo(() => {
  return notifications.filter(
    (notification) => notification.type === selectedType
  );
}, [notifications, selectedType]);
```

Benefits:
- avoids repeated expensive calculations
- improves rendering efficiency

---

# 4. useCallback Optimization

Callback functions are memoized to prevent unnecessary child component renders.

Example:

```tsx
const handleMarkAsRead = useCallback((id: string) => {
  markNotificationAsRead(id);
}, []);
```

Benefits:
- stable function references
- reduced render propagation

---

# 5. Lazy Loading

Large notification datasets should use lazy loading or infinite scrolling.

Benefits:
- reduced initial load time
- improved rendering performance
- better user experience

---

# 6. Pagination

Notifications are fetched in paginated batches.

Example:

```http
GET /notifications?page=1&limit=10
```

Benefits:
- smaller payload sizes
- faster rendering
- lower memory usage

---

# 7. Efficient State Updates

State updates are optimized to avoid full list re-rendering.

Instead of replacing the entire notification array:

Bad Practice:

```tsx
setNotifications(newNotifications);
```

Optimized Update:

```tsx
setNotifications((prev) =>
  prev.map((notification) =>
    notification.id === updated.id
      ? updated
      : notification
  )
);
```

Benefits:
- reduced rendering overhead
- smoother UI updates

---

# 8. Notification Deduplication

Duplicate notifications received through WebSockets are filtered before rendering.

Benefits:
- prevents redundant rendering
- improves UI consistency

---

# 9. Debounced Filtering

Search and filter operations are debounced.

Benefits:
- reduced unnecessary renders
- improved responsiveness

---

# API Optimization

Frontend API requests are optimized using:

- pagination
- caching
- lightweight responses
- selective field fetching

---

# Responsive UI Design

Material UI responsive layouts ensure compatibility across:

- desktop
- tablet
- mobile devices

Benefits:
- accessibility
- improved usability
- consistent experience

---

# Frontend Logging Integration

Frontend events are logged using the reusable logging middleware.

## Example

```ts
await Log(
  "frontend",
  "info",
  "notification-ui",
  "User marked notification as read"
);
```

```ts
await Log(
  "frontend",
  "error",
  "notification-ui",
  "Failed to establish WebSocket connection"
);
```

---

# Future Frontend Enhancements

Potential future improvements include:

- Service worker integration
- Offline notification caching
- Push notifications
- Virtualized lists
- Optimistic UI updates
- Notification grouping
- Background synchronization

These enhancements improve scalability and user experience.

---

# Stage 5

# High Volume Notification Processing and Fault Tolerance

As the platform scales, the notification system must support large bursts of concurrent notification delivery while maintaining reliability, low latency, and fault tolerance.

Examples of high-volume scenarios include:

- placement announcements
- exam result publication
- campus-wide emergency alerts
- bulk event notifications

These events may generate thousands of notifications simultaneously.

---

# Challenges in High-Volume Notification Systems

Potential system challenges include:

1. Database overload
2. API bottlenecks
3. Message delivery failures
4. Network instability
5. Duplicate notification delivery
6. Slow notification processing
7. Retry storms
8. High memory consumption

---

# Recommended Architecture

```text
Client Request
      |
      v
Notification API Service
      |
      v
Message Queue
      |
      v
Notification Worker Services
      |
      +----------------+
      |                |
      v                v
Database         WebSocket Gateway
```

---

# Why Message Queues?

Instead of processing notifications synchronously during API requests, notifications are pushed into a queue for asynchronous processing.

Benefits:
- lower API latency
- improved scalability
- fault tolerance
- retry capability
- traffic smoothing

---

# Recommended Queue Technologies

Possible technologies include:

| Technology | Purpose |
|---|---|
| Redis + BullMQ | Lightweight queue processing |
| RabbitMQ | Reliable distributed messaging |
| Apache Kafka | High throughput event streaming |

For this system, Redis + BullMQ is recommended because:
- lightweight setup
- fast processing
- retry support
- delayed jobs
- good Node.js ecosystem integration

---

# Notification Processing Flow

## Step 1

Client creates notification request.

```http
POST /api/v1/notifications
```

---

## Step 2

Backend validates request and pushes job into queue.

Example:

```ts
await notificationQueue.add("send-notification", payload);
```

---

## Step 3

Worker service consumes queued jobs asynchronously.

---

## Step 4

Notification is:
- stored in database
- delivered via WebSocket
- logged through middleware

---

# Retry Mechanism

Notification delivery failures are retried automatically.

## Retry Strategy

Example configuration:

```ts
{
  attempts: 5,
  backoff: {
    type: "exponential",
    delay: 1000
  }
}
```

Benefits:
- handles temporary failures
- improves delivery reliability
- reduces manual intervention

---

# Dead Letter Queue (DLQ)

Failed notifications that exceed retry limits are moved into a Dead Letter Queue.

Benefits:
- prevents infinite retry loops
- isolates failed jobs
- improves observability
- enables later inspection

---

# Idempotency

The system should avoid duplicate notification processing.

Example strategy:
- unique notification IDs
- deduplication checks
- idempotent worker execution

Benefits:
- prevents duplicate delivery
- improves consistency

---

# Batch Processing

Bulk notifications should be processed in batches.

Instead of:

```text
1 DB insert per notification
```

Use:

```text
Batch inserts and grouped delivery
```

Benefits:
- lower database overhead
- improved throughput
- reduced network cost

---

# Horizontal Scaling

Worker services can scale horizontally.

Example:

```text
Worker 1
Worker 2
Worker 3
Worker N
```

Benefits:
- improved throughput
- distributed workload
- better fault tolerance

---

# Rate Limiting

Rate limiting prevents system overload.

Possible protections:
- API rate limiting
- queue throttling
- WebSocket event throttling

Benefits:
- protects infrastructure
- prevents abuse
- improves stability

---

# Eventual Consistency

The system follows eventual consistency principles.

Reason:
- asynchronous processing
- distributed workers
- retry mechanisms

This approach improves:
- scalability
- reliability
- throughput

---

# Monitoring and Observability

Critical metrics should be monitored:

| Metric | Purpose |
|---|---|
| Queue size | Detect processing backlog |
| Retry count | Detect delivery failures |
| Processing latency | Detect slow workers |
| Failed jobs | Detect system instability |
| WebSocket failures | Detect delivery issues |

---

# Logging Integration

All queue operations and worker events are logged.

## Example

```ts
await Log(
  "backend",
  "info",
  "notification-worker",
  "Notification job processed successfully"
);
```

```ts
await Log(
  "backend",
  "error",
  "notification-worker",
  "Notification delivery failed after retries"
);
```

---

# Failure Recovery Strategy

Recovery mechanisms include:

- automatic retries
- dead letter queues
- worker restarts
- persistent queue storage
- monitoring alerts

These strategies improve system resilience.

---

# Future Scalability Enhancements

Potential future improvements include:

- distributed event streaming
- multi-region queue replication
- push notification gateways
- email notification pipelines
- distributed tracing
- centralized observability dashboards

These improvements support enterprise-scale growth.

---

# Stage 6

# Priority Notification Processing and Efficient Top-10 Maintenance

The notification platform supports priority-based notifications to ensure that important updates are surfaced immediately to users.

Examples of high-priority notifications include:

- placement deadlines
- emergency campus alerts
- result announcements
- interview schedules

The system must efficiently maintain the highest priority notifications without repeatedly sorting the full dataset.

---

# Problem Statement

If the platform stores thousands or millions of notifications, repeatedly sorting the entire notification list becomes computationally expensive.

Example inefficient approach:

```ts
notifications.sort((a, b) => b.priority - a.priority);
```

Problems:
- expensive repeated sorting
- poor scalability
- increased latency
- inefficient CPU usage

Time Complexity:
```text
O(n log n)
```

This becomes inefficient at scale.

---

# Recommended Data Structure

A Min Heap (Priority Queue) is recommended for maintaining the top 10 highest priority notifications.

---

# Why Min Heap?

A Min Heap allows:

- efficient insertion
- efficient removal
- efficient top-10 maintenance
- lower computational overhead

---

# Heap Strategy

## Core Idea

Maintain:
- a Min Heap of size 10

Rules:
- if heap size < 10:
  - insert notification
- else:
  - compare with smallest priority item
  - replace if higher priority exists

This ensures:
- only top 10 notifications remain
- minimal sorting overhead

---

# Time Complexity Analysis

| Operation | Complexity |
|---|---|
| Insert into heap | O(log k) |
| Remove minimum | O(log k) |
| Fetch top notifications | O(k) |

Where:
```text
k = 10
```

This is significantly more efficient than repeatedly sorting all notifications.

---

# Example Notification Structure

```ts
interface Notification {
  id: string;
  title: string;
  priority: number;
  createdAt: string;
}
```

---

# Sample Heap-Based Algorithm

```ts
class MinHeap {
  heap: Notification[] = [];

  insert(notification: Notification) {
    // Heap insertion logic
  }

  removeMin() {
    // Remove minimum priority item
  }

  peek() {
    return this.heap[0];
  }
}
```

---

# Top-10 Maintenance Logic

```ts
for (const notification of notifications) {
  if (heap.size() < 10) {
    heap.insert(notification);
  } else if (
    notification.priority > heap.peek().priority
  ) {
    heap.removeMin();
    heap.insert(notification);
  }
}
```

---

# Why This Approach Is Efficient

Instead of sorting:

```text
O(n log n)
```

The heap approach reduces processing to:

```text
O(n log k)
```

Where:
```text
k = 10
```

Since:
```text
log(10)
```

is extremely small, performance improves significantly.

---

# Real-Time Priority Updates

When new notifications arrive:

1. Compare priority against heap minimum
2. Update heap if required
3. Push updated top notifications to frontend

Benefits:
- instant priority updates
- efficient processing
- scalable architecture

---

# Priority Notification Delivery

High-priority notifications may bypass standard queues.

Possible strategies:
- dedicated priority queues
- faster retry intervals
- immediate WebSocket delivery

Benefits:
- reduced delivery latency
- improved visibility
- better user responsiveness

---

# Scalability Considerations

As notification volume grows:

- heap operations remain efficient
- memory usage remains controlled
- processing cost stays predictable

This makes the architecture suitable for large-scale deployments.

---

# Logging Integration

Priority processing events are logged using the reusable middleware.

## Example

```ts
await Log(
  "backend",
  "info",
  "priority-notification-service",
  "Top 10 priority notifications updated"
);
```

```ts
await Log(
  "backend",
  "warn",
  "priority-notification-service",
  "High-priority notification queue spike detected"
);
```

---

# Future Improvements

Potential future enhancements include:

- distributed priority queues
- AI-based notification ranking
- personalized notification prioritization
- adaptive priority scoring
- machine learning recommendation systems

These improvements can further enhance user experience and scalability.