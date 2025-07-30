import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('Connected to server:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  // Lesson-specific methods
  joinLesson(sessionId, userId) {
    if (this.socket) {
      this.socket.emit('join-lesson', { sessionId, userId });
    }
  }

  sendMessage(data) {
    if (this.socket) {
      this.socket.emit('send-message', data);
    }
  }

  changeStep(sessionId, newStep) {
    if (this.socket) {
      this.socket.emit('change-step', { sessionId, newStep });
    }
  }

  changeSpeaker(sessionId, speakerId) {
    if (this.socket) {
      this.socket.emit('change-speaker', { sessionId, speakerId });
    }
  }

  // Event listeners
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new-message', callback);
    }
  }

  onStepChanged(callback) {
    if (this.socket) {
      this.socket.on('step-changed', callback);
    }
  }

  onSpeakerChanged(callback) {
    if (this.socket) {
      this.socket.on('speaker-changed', callback);
    }
  }

  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on('user-joined', callback);
    }
  }

  onUserLeft(callback) {
    if (this.socket) {
      this.socket.on('user-left', callback);
    }
  }

  onSessionState(callback) {
    if (this.socket) {
      this.socket.on('session-state', callback);
    }
  }

  // Remove event listeners
  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export const socketService = new SocketService();