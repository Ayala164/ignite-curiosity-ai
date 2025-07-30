// טיפוסי נתונים למערכת השיעורים והילדים

export interface Child {
  id: string;
  name: string;
  avatar: string;
  personality: string; // תיאור אישיות לשימוש ה-AI
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'child' | 'ai';
  content: string;
  timestamp: Date;
  reactions?: string[];
}

export interface LessonStep {
  id: string;
  title: string;
  description: string;
  aiPrompt: string;
  expectedResponses?: string[];
  duration?: number; // דקות
}

export interface Lesson {
  id: string;
  title: string;
  subject: string;
  targetAge: number;
  description: string;
  steps: LessonStep[];
  participants: Child[];
}

export interface ChatSession {
  id: string;
  lessonId: string;
  messages: Message[];
  currentStep: number;
  currentSpeaker: string | null;
  isActive: boolean;
  startTime: Date;
}