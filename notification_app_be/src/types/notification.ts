export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "Placement" | "Event" | "Result";
  isRead: boolean;
  priority: number;
  createdAt: string;
}