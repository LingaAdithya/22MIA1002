import {
  Container,
  Typography,
  CircularProgress,
  MenuItem,
  TextField,
  Stack,
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

  const [filterType, setFilterType] =
    useState("All");

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

  const filteredNotifications =
    filterType === "All"
      ? notifications
      : notifications.filter(
          (notification) =>
            notification.type === filterType
        );

  filteredNotifications.sort(
    (a, b) => b.priority - a.priority
  );

  if (loading) {
    return (
      <Container sx={{ mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{ mt: 5 }}
    >

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
      >
        Campus Notifications
      </Typography>

      <CreateNotificationForm />

      <Stack mb={3}>
        <TextField
          select
          label="Filter Notifications"
          value={filterType}
          onChange={(e) =>
            setFilterType(e.target.value)
          }
        >

          <MenuItem value="All">
            All
          </MenuItem>

          <MenuItem value="Placement">
            Placement
          </MenuItem>

          <MenuItem value="Event">
            Event
          </MenuItem>

          <MenuItem value="Result">
            Result
          </MenuItem>

        </TextField>
      </Stack>

      {filteredNotifications.map(
        (notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
          />
        )
      )}

    </Container>
  );
}