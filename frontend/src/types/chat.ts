export interface IMessage {
  _id: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  roomType: 'event' | 'club' | 'project' | 'direct';
  roomId: string;
  content: string;
  createdAt: string;
}

export interface IConversation {
  _id: string;
  participants: {
    _id: string;
    name: string;
    avatar?: string;
    major?: string;
  }[];
  lastMessage?: IMessage;
  updatedAt: string;
}
