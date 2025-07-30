import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChatMessage } from "./ChatMessage";
import { ParticipantList } from "./ParticipantList";
import { Message, ChatSession, Child, Lesson } from "@/types/lesson";
import { mockChildResponses } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface LessonInterfaceProps {
  lesson: Lesson;
  onEndLesson: () => void;
}

export const LessonInterface = ({ lesson, onEndLesson }: LessonInterfaceProps) => {
  const [session, setSession] = useState<ChatSession>({
    id: `session-${Date.now()}`,
    lessonId: lesson.id,
    messages: [],
    currentStep: 0,
    currentSpeaker: null,
    isActive: true,
    startTime: new Date()
  });
  
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [childResponseIndex, setChildResponseIndex] = useState<Record<string, number>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // גלילה אוטומטית להודעה האחרונה
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages]);

  // הוספת הודעה חדשה
  const addMessage = (senderId: string, senderName: string, content: string, senderType: 'child' | 'ai') => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      senderId,
      senderName,
      senderType,
      content,
      timestamp: new Date()
    };

    setSession(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
  };

  // התחלת השיעור עם ברכה
  useEffect(() => {
    const startLesson = () => {
      addMessage(
        "ai-teacher",
        "המנחה",
        `שלום ילדים יקרים! ברוכים הבאים לשיעור "${lesson.title}". אני מאוד נרגש לבלות איתכם ולחקור יחד נושאים מרתקים! 🌟`,
        "ai"
      );
      
      setTimeout(() => {
        const currentStep = lesson.steps[0];
        addMessage("ai-teacher", "המנחה", currentStep.aiPrompt, "ai");
      }, 2000);
    };

    startLesson();
  }, [lesson]);

  // מעבר לשלב הבא
  const moveToNextStep = () => {
    const nextStepIndex = session.currentStep + 1;
    if (nextStepIndex < lesson.steps.length) {
      setSession(prev => ({ ...prev, currentStep: nextStepIndex }));
      const nextStep = lesson.steps[nextStepIndex];
      
      setTimeout(() => {
        addMessage("ai-teacher", "המנחה", nextStep.aiPrompt, "ai");
      }, 1000);
    } else {
      // סיום השיעור
      addMessage(
        "ai-teacher", 
        "המנחה", 
        "איזה שיעור נפלא היה לנו! תודה לכולכם על השתתפות פעילה ורעיונות מדהימים. אתם יזמים אמיתיים! 🎉", 
        "ai"
      );
      
      toast({
        title: "השיעור הסתיים!",
        description: "כל הכבוד על השתתפות פעילה ויצירתית",
      });
      
      setTimeout(() => {
        setSession(prev => ({ ...prev, isActive: false }));
      }, 3000);
    }
  };

  // בחירת ילד אקראי לתגובה
  const selectRandomChild = () => {
    const availableChildren = lesson.participants.filter(child => 
      session.currentSpeaker !== child.id
    );
    
    if (availableChildren.length > 0) {
      const randomChild = availableChildren[Math.floor(Math.random() * availableChildren.length)];
      setSession(prev => ({ ...prev, currentSpeaker: randomChild.id }));
      return randomChild;
    }
    return null;
  };

  // תגובה של ילד (סימולציה)
  const simulateChildResponse = () => {
    const child = selectRandomChild();
    if (!child) return;

    const currentIndex = childResponseIndex[child.id] || 0;
    const responses = mockChildResponses[child.id as keyof typeof mockChildResponses] || ["כן, נכון!"];
    const response = responses[currentIndex % responses.length];
    
    setChildResponseIndex(prev => ({
      ...prev,
      [child.id]: currentIndex + 1
    }));

    setTimeout(() => {
      addMessage(child.id, child.name, response, "child");
      
      // איפוס הדובר הנוכחי אחרי תגובה
      setTimeout(() => {
        setSession(prev => ({ ...prev, currentSpeaker: null }));
      }, 1000);
    }, 1000 + Math.random() * 2000); // תגובה אחרי 1-3 שניות
  };

  // תגובת AI חכמה לילדים
  const generateAIResponse = () => {
    setIsAISpeaking(true);
    
    const responses = [
      "איזה רעיון מעניין! מי עוד חושב כך?",
      "אהבתי את הרעיון הזה! בואו נשמע עוד דעות",
      "חשיבה מצוינת! איך אתם חושבים שנוכל ליישם את זה?",
      "תשובה נהדרת! מי יכול להוסיף משהו לרעיון הזה?",
      "מעולה! אני רואה שאתם חושבים כמו יזמים אמיתיים!"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    setTimeout(() => {
      addMessage("ai-teacher", "המנחה", randomResponse, "ai");
      setIsAISpeaking(false);
    }, 2000 + Math.random() * 2000);
  };

  const currentStep = lesson.steps[session.currentStep];

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* כותרת השיעור */}
      <div className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
            <p className="text-primary-foreground/80">{lesson.subject} • גיל {lesson.targetAge}</p>
          </div>
          <div className="flex items-center gap-4">
            {currentStep && (
              <Badge variant="secondary" className="text-sm">
                שלב {session.currentStep + 1}: {currentStep.title}
              </Badge>
            )}
            <Button 
              variant="outline" 
              onClick={onEndLesson}
              className="bg-primary-foreground text-primary"
            >
              סיום השיעור
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* אזור הצ'אט */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                💬 שיחת הקבוצה
                <div className="flex gap-2">
                  <Button 
                    onClick={simulateChildResponse}
                    disabled={!session.isActive}
                    variant="outline"
                    size="sm"
                  >
                    תגובת ילד
                  </Button>
                  <Button 
                    onClick={generateAIResponse}
                    disabled={!session.isActive || isAISpeaking}
                    variant="outline" 
                    size="sm"
                  >
                    תגובת AI
                  </Button>
                  <Button 
                    onClick={moveToNextStep}
                    disabled={!session.isActive || session.currentStep >= lesson.steps.length - 1}
                    size="sm"
                  >
                    שלב הבא
                  </Button>
                  <Button 
                    onClick={moveToNextStep}
                    disabled={!session.isActive || session.currentStep >= lesson.steps.length - 1}
                    variant="secondary"
                    size="sm"
                  >
                    דלג לשלב הבא
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {session.messages.map((message) => (
                    <ChatMessage 
                      key={message.id} 
                      message={message} 
                      isAI={message.senderType === 'ai'}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* רשימת משתתפים */}
        <div className="w-80">
          <ParticipantList 
            participants={lesson.participants}
            currentSpeaker={session.currentSpeaker}
            aiSpeaking={isAISpeaking}
          />
          
          {/* פרטי השלב הנוכחי */}
          {currentStep && (
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">📋 השלב הנוכחי</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <h4 className="font-medium">{currentStep.title}</h4>
                <p className="text-sm text-muted-foreground">{currentStep.description}</p>
                {currentStep.duration && (
                  <Badge variant="outline" className="text-xs">
                    ⏱️ {currentStep.duration} דקות
                  </Badge>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};