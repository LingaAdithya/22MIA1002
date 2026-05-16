import axios from "axios";

const API_BASE_URL =
  "http://localhost:5000/api/v1/notifications";

export async function fetchNotifications() {
  const response = await axios.get(API_BASE_URL);

  return response.data.data;
}

export async function createNotification(
  notification: any
) {
  const response = await axios.post(
    API_BASE_URL,
    notification
  );

  return response.data.data;
}

export async function markAsRead(
  id: string
) {
  const response = await axios.patch(
    `${API_BASE_URL}/${id}/read`
  );

  return response.data.data;
}