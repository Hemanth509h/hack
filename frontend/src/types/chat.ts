export interface IMessage {
  _id: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  roomType: 'event' | 'club' | 'team';
  roomId: string;
  content: string;
  createdAt: string;
}
