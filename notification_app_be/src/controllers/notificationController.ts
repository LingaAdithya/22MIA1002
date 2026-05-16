import type { Request, Response } from "express";
import {
  getNotifications,
  createNotification,
  markNotificationAsRead,
} from "../services/notificationService";
import { Log } from "logging_middleware";


export async function fetchNotifications(
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> {

  const notifications = getNotifications();

  await Log(
    "backend",
    "info",
    "notification-controller",
    "Fetched notifications successfully"
  );

  return res.status(200).json({
    success: true,
    data: notifications,
  });
}

export async function addNotification(
  req: Request,
  res: Response
) {
  const notification = createNotification(req.body);
  await Log(
  "backend",
  "info",
  "notification-controller",
  "Notification created successfully"
);

  return res.status(201).json({
    success: true,
    data: notification,
  });
}

export async function readNotification(
  req: Request,
  res: Response
): Promise<Response> {

  const notification =
    markNotificationAsRead(req.params.id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found",
    });
  }

  await Log(
    "backend",
    "info",
    "notification-controller",
    "Notification marked as read"
  );

  return res.status(200).json({
    success: true,
    data: notification,
  });
}