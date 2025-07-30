// טיפוסי נתונים למערכת השיעורים והילדים

// Child interface
// {
//   id: string;
//   name: string;
//   avatar: string;
//   personality: string; // תיאור אישיות לשימוש ה-AI
// }

// Message interface
// {
//   id: string;
//   senderId: string;
//   senderName: string;
//   senderType: 'child' | 'ai';
//   content: string;
//   timestamp: Date;
//   reactions?: string[];
// }

// LessonStep interface
// {
//   id: string;
//   title: string;
//   description: string;
//   aiPrompt: string;
//   expectedResponses?: string[];
//   duration?: number; // דקות
// }

// Lesson interface
// {
//   id: string;
//   title: string;
//   subject: string;
//   targetAge: number;
//   description: string;
//   steps: LessonStep[];
//   participants: Child[];
// }

// ChatSession interface
// {
//   id: string;
//   lessonId: string;
//   messages: Message[];
//   currentStep: number;
//   currentSpeaker: string | null;
//   isActive: boolean;
//   startTime: Date;
// }