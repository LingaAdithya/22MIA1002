import { Router } from "express";

import {
  fetchNotifications,
  addNotification,
} from "../controllers/notificationController";

const router = Router();

router.get("/", fetchNotifications);

router.post("/", addNotification);

export default router;