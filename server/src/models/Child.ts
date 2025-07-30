import mongoose, { Document, Schema } from 'mongoose';

export interface IChild extends Document {
  _id: string;
  name: string;
  avatar: string;
  personality: string;
  age?: number;
  preferences?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const childSchema = new Schema<IChild>({
  name: {
    type: String,
    required: [true, 'Child name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  avatar: {
    type: String,
    default: '/api/placeholder/100/100'
  },
  personality: {
    type: String,
    required: [true, 'Personality description is required'],
    maxlength: [200, 'Personality description cannot exceed 200 characters']
  },
  age: {
    type: Number,
    min: [5, 'Age must be at least 5'],
    max: [18, 'Age cannot exceed 18']
  },
  preferences: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
childSchema.index({ name: 1 });
childSchema.index({ age: 1 });

export const Child = mongoose.model<IChild>('Child', childSchema);