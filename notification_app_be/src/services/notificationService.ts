import type { Notification } from "../types/notification";

const notifications: Notification[] = [
  {
    id: "1",
    title: "Placement Opportunity",
    message: "Company XYZ hiring for SDE roles",
    type: "Placement",
    isRead: false,
    priority: 5,
    createdAt: new Date().toISOString(),
  },
];

export function getNotifications(): Notification[] {
  return notifications;
}

export function createNotification(
  notification: Notification
): Notification {
  notifications.push(notification);

  return notification;
}