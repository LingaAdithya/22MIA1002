import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
} from "@mui/material";

import type { Notification } from "../types/notification";

import { markAsRead } from "../services/notificationService";

interface Props {
  notification: Notification;
}

export default function NotificationCard({
  notification,
}: Props) {

  async function handleRead() {
    await markAsRead(notification.id);

    window.location.reload();
  }

  return (
    <Card
      sx={{
        borderRadius: 3,
        mb: 2,
        opacity: notification.isRead
          ? 0.7
          : 1,
      }}
    >
      <CardContent>

        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h6">
            {notification.title}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
          >
            <Chip
              label={notification.type}
              color="primary"
            />

            <Chip
              label={
                notification.isRead
                  ? "Read"
                  : "Unread"
              }
              color={
                notification.isRead
                  ? "success"
                  : "warning"
              }
            />
          </Stack>

        </Stack>

        <Typography variant="body1" mb={2}>
          {notification.message}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mb={2}
        >
          {new Date(
            notification.createdAt
          ).toLocaleString()}
        </Typography>

        {!notification.isRead && (
          <Button
            variant="contained"
            onClick={handleRead}
          >
            Mark As Read
          </Button>
        )}

      </CardContent>
    </Card>
  );
}