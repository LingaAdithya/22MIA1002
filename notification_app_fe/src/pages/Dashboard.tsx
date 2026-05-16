import {
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";

import { useEffect, useState } from "react";

import NotificationCard from "../components/NotificationCard";

import type { Notification } from "../types/notification";

import { fetchNotifications } from "../services/notificationService";

import CreateNotificationForm from "../components/CreateNotificationForm";

export default function Dashboard() {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data =
          await fetchNotifications();

        setNotifications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
  <Typography
    variant="h4"
    fontWeight="bold"
    mb={4}
  >
    Campus Notifications
  </Typography>

  <CreateNotificationForm />

  {notifications.map((notification) => (
    <NotificationCard
      key={notification.id}
      notification={notification}
    />
  ))}
</Container>
    
  );
}