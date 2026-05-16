import type { Notification } from "../types/notification";

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Placement Opportunity",
    message: "Company XYZ is hiring for SDE roles",
    type: "Placement",
    isRead: false,
    priority: 5,
    createdAt: "2026-05-16T10:00:00Z",
  },
  {
    id: "2",
    title: "Campus Event",
    message: "Tech fest starts tomorrow",
    type: "Event",
    isRead: true,
    priority: 2,
    createdAt: "2026-05-15T09:00:00Z",
  },
  {
    id: "3",
    title: "Result Published",
    message: "Semester results are available",
    type: "Result",
    isRead: false,
    priority: 4,
    createdAt: "2026-05-14T08:00:00Z",
  },
];