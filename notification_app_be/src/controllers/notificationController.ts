import type { Request, Response } from "express";

import {
  getNotifications,
  createNotification,
} from "../services/notificationService";

export async function fetchNotifications(
  req: Request,
  res: Response
) {
  const notifications = getNotifications();

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

  return res.status(201).json({
    success: true,
    data: notification,
  });
}