import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'child' | 'ai';
  content: string;
  timestamp: Date;
  reactions?: string[];
}

export interface IChatSession extends Document {
  _id: string;
  lessonId: string;
  messages: IMessage[];
  currentStep: number;
  currentSpeaker: string | null;
  isActive: boolean;
  startTime: Date;
  endTime?: Date;
  participants: string[]; // Child IDs
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  id: {
    type: String,
    required: true
  },
  senderId: {
    type: String,
    required: true
  },
  senderName: {
    type: String,
    required: true,
    trim: true
  },
  senderType: {
    type: String,
    enum: ['child', 'ai'],
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  reactions: [{
    type: String
  }]
}, { _id: false });

const chatSessionSchema = new Schema<IChatSession>({
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson',
    required: [true, 'Lesson ID is required']
  },
  messages: [messageSchema],
  currentStep: {
    type: Number,
    default: 0,
    min: [0, 'Current step cannot be negative']
  },
  currentSpeaker: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'Child'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
chatSessionSchema.index({ lessonId: 1 });
chatSessionSchema.index({ isActive: 1 });
chatSessionSchema.index({ startTime: -1 });

export const ChatSession = mongoose.model<IChatSession>('ChatSession', chatSessionSchema);