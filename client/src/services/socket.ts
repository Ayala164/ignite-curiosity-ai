import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
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

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // Lesson-specific methods
  joinLesson(sessionId: string, userId: string): void {
    if (this.socket) {
      this.socket.emit('join-lesson', { sessionId, userId });
    }
  }

  sendMessage(data: {
    sessionId: string;
    senderId: string;
    senderName: string;
    senderType: 'child' | 'ai';
    content: string;
  }): void {
    if (this.socket) {
      this.socket.emit('send-message', data);
    }
  }

  changeStep(sessionId: string, newStep: number): void {
    if (this.socket) {
      this.socket.emit('change-step', { sessionId, newStep });
    }
  }

  changeSpeaker(sessionId: string, speakerId: string | null): void {
    if (this.socket) {
      this.socket.emit('change-speaker', { sessionId, speakerId });
    }
  }

  // Event listeners
  onNewMessage(callback: (message: any) => void): void {
    if (this.socket) {
      this.socket.on('new-message', callback);
    }
  }

  onStepChanged(callback: (data: { newStep: number }) => void): void {
    if (this.socket) {
      this.socket.on('step-changed', callback);
    }
  }

  onSpeakerChanged(callback: (data: { speakerId: string | null }) => void): void {
    if (this.socket) {
      this.socket.on('speaker-changed', callback);
    }
  }

  onUserJoined(callback: (data: { userId: string; message: string }) => void): void {
    if (this.socket) {
      this.socket.on('user-joined', callback);
    }
  }

  onUserLeft(callback: (data: { userId: string; message: string }) => void): void {
    if (this.socket) {
      this.socket.on('user-left', callback);
    }
  }

  onSessionState(callback: (session: any) => void): void {
    if (this.socket) {
      this.socket.on('session-state', callback);
    }
  }

  // Remove event listeners
  off(event: string): void {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export const socketService = new SocketService();