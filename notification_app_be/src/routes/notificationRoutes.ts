import { Router } from "express";

import {
  fetchNotifications,
  addNotification,
  readNotification,
} from "../controllers/notificationController";

const router = Router();

router.get("/", fetchNotifications);

router.post("/", addNotification);

router.patch("/:id/read", readNotification);

export default router;