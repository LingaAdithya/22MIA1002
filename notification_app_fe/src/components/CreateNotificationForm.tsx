import {
  Box,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";

import { useState } from "react";

import { createNotification } from "../services/notificationService";

export default function CreateNotificationForm() {

  const [title, setTitle] = useState("");

  const [message, setMessage] =
    useState("");

  const [type, setType] =
    useState("Placement");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    await createNotification({
      id: crypto.randomUUID(),
      title,
      message,
      type,
      isRead: false,
      priority: 1,
      createdAt: new Date().toISOString(),
    });

    window.location.reload();
  }

  const darkFieldStyles = {
    "& .MuiInputLabel-root": {
      color: "#bbb",
    },

    "& .MuiOutlinedInput-root": {
      color: "#fff",

      "& fieldset": {
        borderColor: "#555",
      },

      "&:hover fieldset": {
        borderColor: "#888",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#1976d2",
      },
    },

    "& .MuiSvgIcon-root": {
      color: "#fff",
    },
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mb: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >

      <TextField
        label="Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        required
        sx={darkFieldStyles}
      />

      <TextField
        label="Message"
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
        required
        sx={darkFieldStyles}
      />

      <TextField
        select
        label="Type"
        value={type}
        onChange={(e) =>
          setType(e.target.value)
        }
        sx={darkFieldStyles}
      >

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

      <Button
        type="submit"
        variant="contained"
        size="large"
      >
        Create Notification
      </Button>

    </Box>
  );
}