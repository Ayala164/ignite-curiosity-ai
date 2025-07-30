// This file is kept for reference but no longer used in production
// All data now comes from MongoDB via the API

// Example data structure for reference:
/*
Child: {
  _id: string,
  name: string,
  avatar: string,
  personality: string,
  age: number,
  preferences: string[]
}

Lesson: {
  _id: string,
  title: string,
  subject: string,
  targetAge: number,
  description: string,
  steps: [{
    id: string,
    title: string,
    description: string,
    aiPrompt: string,
    expectedResponses: string[],
    duration: number
  }],
  participants: Child[],
  isActive: boolean
}

ChatSession: {
  _id: string,
  lessonId: string,
  messages: [{
    id: string,
    senderId: string,
    senderName: string,
    senderType: 'child' | 'ai',
    content: string,
    timestamp: Date,
    reactions: string[]
  }],
  currentStep: number,
  currentSpeaker: string,
  isActive: boolean,
  startTime: Date,
  endTime: Date,
  participants: string[]
}
*/

export const mockData = {
  note: "This file is for reference only. All data now comes from MongoDB."
};