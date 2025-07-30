import { ChatSession } from '../models/ChatSession.js';

export const handleSocketConnection = (socket, io) => {
  console.log(`Socket connected: ${socket.id}`);

  // Join a lesson room
  socket.on('join-lesson', async (data) => {
    try {
      const { sessionId, userId } = data;
      
      // Validate session exists
      const session = await ChatSession.findById(sessionId);
      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }

      // Join the room
      socket.join(sessionId);
      socket.data.sessionId = sessionId;
      socket.data.userId = userId;

      console.log(`User ${userId} joined lesson ${sessionId}`);
      
      // Notify others in the room
      socket.to(sessionId).emit('user-joined', {
        userId,
        message: `User ${userId} joined the lesson`
      });

      // Send current session state
      socket.emit('session-state', session);
      
    } catch (error) {
      console.error('Error joining lesson:', error);
      socket.emit('error', { message: 'Error joining lesson' });
    }
  });

  // Handle new message
  socket.on('send-message', async (data) => {
    try {
      const { sessionId, senderId, senderName, senderType, content } = data;

      const message = {
        id: `msg-${Date.now()}-${Math.random()}`,
        senderId,
        senderName,
        senderType,
        content,
        timestamp: new Date(),
        reactions: []
      };

      // Save message to database
      const session = await ChatSession.findByIdAndUpdate(
        sessionId,
        { $push: { messages: message } },
        { new: true }
      );

      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }

      // Broadcast message to all users in the room
      io.to(sessionId).emit('new-message', message);

    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Error sending message' });
    }
  });

  // Handle step change
  socket.on('change-step', async (data) => {
    try {
      const { sessionId, newStep } = data;

      const session = await ChatSession.findByIdAndUpdate(
        sessionId,
        { currentStep: newStep },
        { new: true }
      );

      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }

      // Broadcast step change to all users in the room
      io.to(sessionId).emit('step-changed', { newStep });

    } catch (error) {
      console.error('Error changing step:', error);
      socket.emit('error', { message: 'Error changing step' });
    }
  });

  // Handle speaker change
  socket.on('change-speaker', async (data) => {
    try {
      const { sessionId, speakerId } = data;

      const session = await ChatSession.findByIdAndUpdate(
        sessionId,
        { currentSpeaker: speakerId },
        { new: true }
      );

      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }

      // Broadcast speaker change to all users in the room
      io.to(sessionId).emit('speaker-changed', { speakerId });

    } catch (error) {
      console.error('Error changing speaker:', error);
      socket.emit('error', { message: 'Error changing speaker' });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
    
    if (socket.data.sessionId && socket.data.userId) {
      // Notify others in the room
      socket.to(socket.data.sessionId).emit('user-left', {
        userId: socket.data.userId,
        message: `User ${socket.data.userId} left the lesson`
      });
    }
  });
};