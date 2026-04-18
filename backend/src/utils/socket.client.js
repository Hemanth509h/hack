import { io, Socket } from 'socket.io-client';

/**
 * SocketClient Utility
 * 
 * Provides a managed wrapper around Socket.io client for The Quad platform.
 * Handles authentication, room management, and event listeners.
 */
export class SocketClient {
  socket: Socket | null = null;
  token: string | null = null;
  baseUrl;

  constructor(baseUrl = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Initialize connection with JWT token
   */
  connect(token) {
    this.token = token;
    
    this.socket = io(this.baseUrl, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    this.setupDefaultListeners();
    return this.socket;
  }

  setupDefaultListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('[Socket] Connected to server:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('[Socket] Disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
    });

    this.socket.on('error', (data) => {
      console.error('[Socket] Application error:', data);
    });
  }

  /**
   * Join a specific room (event, club, or project)
   */
  joinRoom(type: 'event' | 'club' | 'project', id) {
    this.socket?.emit('room:join', { type, id });
  }

  /**
   * Leave a specific room
   */
  leaveRoom(type: 'event' | 'club' | 'project', id) {
    this.socket?.emit('room:leave', { type, id });
  }

  /**
   * Send a chat message
   */
  sendMessage(roomType: 'event' | 'club' | 'project', roomId, content) {
    this.socket?.emit('chat:send', { roomType, roomId, content });
  }

  /**
   * Signal typing status
   */
  sendTyping(roomType, roomId) {
    this.socket?.emit('chat:typing', { roomType, roomId });
  }

  /**
   * Request chat history
   */
  requestHistory(roomType: 'event' | 'club' | 'project', roomId, limit = 50) {
    this.socket?.emit('chat:history', { roomType, roomId, limit });
  }

  /**
   * Global listener for new notifications
   */
  onNotification(callback: (data) => void) {
    this.socket?.on('notification:new', callback);
  }

  /**
   * Listener for RSVP updates in the current event room
   */
  onRsvpUpdate(callback: (data) => void) {
    this.socket?.on('event:rsvp_update', callback);
  }

  /**
   * Listener for event status changes
   */
  onEventStatusChange(callback: (data) => void) {
    this.socket?.on('event:status_change', callback);
  }

  /**
   * Listener for chat messages
   */
  onChatMessage(callback: (data) => void) {
    this.socket?.on('chat:message', callback);
  }

  /**
   * Listener for interest-match events
   */
  onNewMatch(callback: (data) => void) {
    this.socket?.on('event:new_match', callback);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

// Example usage:
// const client = new SocketClient();
// client.connect(userToken);
// client.onNotification((notif) => console.log('New notification:', notif.title));
// client.joinRoom('event', 'event_id_123');
// client.onRsvpUpdate((update) => console.log('RSVP Count:', update.rsvpCount));
