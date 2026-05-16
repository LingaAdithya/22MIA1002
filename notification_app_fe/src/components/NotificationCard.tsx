import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
} from "@mui/material";

import type { Notification } from "../types/notification";

interface Props {
  notification: Notification;
}

export default function NotificationCard({
  notification,
}: Props) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        mb: 2,
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

          <Chip
            label={notification.type}
            color="primary"
          />
        </Stack>

        <Typography variant="body1" mb={2}>
          {notification.message}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {new Date(
            notification.createdAt
          ).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
}