import {
  Container,
  Typography,
} from "@mui/material";

import NotificationCard from "../components/NotificationCard";
import { mockNotifications } from "../utils/mockNotifications";

export default function Dashboard() {
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
      >
        Campus Notifications
      </Typography>

      {mockNotifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
        />
      ))}
    </Container>
  );
}