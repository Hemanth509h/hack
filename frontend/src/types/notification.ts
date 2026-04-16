export interface INotification {
  _id: string;
  recipient: string;
  type: string; // 'system' | 'team_request' | 'event_update' | 'club_announcement' etc
  title: string;
  message: string;
  dataPayload?: any;
  isRead: boolean;
  createdAt: string;
}

export interface INotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
}
