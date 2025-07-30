import mongoose, { Document, Schema } from 'mongoose';

export interface ILessonStep {
  id: string;
  title: string;
  description: string;
  aiPrompt: string;
  expectedResponses?: string[];
  duration?: number;
}

export interface ILesson extends Document {
  _id: string;
  title: string;
  subject: string;
  targetAge: number;
  description: string;
  steps: ILessonStep[];
  participants: string[]; // Child IDs
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const lessonStepSchema = new Schema<ILessonStep>({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Step title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Step description is required']
  },
  aiPrompt: {
    type: String,
    required: [true, 'AI prompt is required']
  },
  expectedResponses: [{
    type: String
  }],
  duration: {
    type: Number,
    min: [1, 'Duration must be at least 1 minute'],
    max: [120, 'Duration cannot exceed 120 minutes']
  }
}, { _id: false });

const lessonSchema = new Schema<ILesson>({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  targetAge: {
    type: Number,
    required: [true, 'Target age is required'],
    min: [5, 'Target age must be at least 5'],
    max: [18, 'Target age cannot exceed 18']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  steps: [lessonStepSchema],
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'Child'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
lessonSchema.index({ subject: 1 });
lessonSchema.index({ targetAge: 1 });
lessonSchema.index({ isActive: 1 });

export const Lesson = mongoose.model<ILesson>('Lesson', lessonSchema);