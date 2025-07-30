import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChatMessage } from "./ChatMessage";
import { ParticipantList } from "./ParticipantList";
import { mockChildResponses } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/hooks/useAPI";
import { socketService } from "@/services/socket";

export const LessonInterface = ({ lesson, sessionId, onEndLesson }) => {
  const { session, loading, error, addMessage: addMessageToSession, updateSession } = useSession(sessionId);
  
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  // גלילה אוטומטית להודעה האחרונה
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);

  // Initialize socket connection
  useEffect(() => {
    if (!sessionId) return;

    const socket = socketService.connect();
    socketService.joinLesson(sessionId, 'teacher-user');

    // Listen for new messages
    socketService.onNewMessage((message) => {
      // Message will be handled by the useSession hook
    });

    // Listen for step changes
    socketService.onStepChanged(({ newStep }) => {
      // Update local state if needed
    });

    return () => {
      socketService.disconnect();
    };
  }, [sessionId]);
  // הוספת הודעה חדשה
  const addMessage = async (senderId, senderName, content, senderType) => {
    try {
      const messageData = {
      senderId,
      senderName,
      senderType,
      content
      };

      // Add message via API
      await addMessageToSession(messageData);
      
      // Also send via socket for real-time updates
      socketService.sendMessage({
        sessionId,
        ...messageData
      });
    } catch (error) {
      console.error('Error adding message:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לשלוח הודעה",
        variant: "destructive"
      });
    }
  };

  // התחלת השיעור עם ברכה
  useEffect(() => {
    if (!session || session.messages.length > 0) return;

    const startLesson = async () => {
      await addMessage(
        "ai-teacher",
        "המנחה",
        `שלום ילדים יקרים! ברוכים הבאים לשיעור "${lesson.title}". אני מאוד נרגש לבלות איתכם ולחקור יחד נושאים מרתקים! 🌟`,
        "ai"
      );
      
      setTimeout(() => {
        if (lesson.steps && lesson.steps.length > 0) {
          const currentStep = lesson.steps[0];
          addMessage("ai-teacher", "המנחה", currentStep.aiPrompt, "ai");
        }
      }, 2000);
    };

    startLesson();
  }, [lesson, session]);

  // מעבר לשלב הבא
  const moveToNextStep = async () => {
    if (!session || !lesson.steps) return;

    const nextStepIndex = session.currentStep + 1;
    if (nextStepIndex < lesson.steps.length) {
      try {
        await updateSession({ currentStep: nextStepIndex });
        socketService.changeStep(sessionId, nextStepIndex);
        
      const nextStep = lesson.steps[nextStepIndex];
      
      setTimeout(() => {
          addMessage("ai-teacher", "המנחה", nextStep.aiPrompt, "ai");
      }, 1000);
      } catch (error) {
        console.error('Error moving to next step:', error);
        toast({
          title: "שגיאה",
          description: "לא ניתן לעבור לשלב הבא",
          variant: "destructive"
        });
      }
    } else {
      // סיום השיעור
      await addMessage(
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
        updateSession({ isActive: false });
      }, 3000);
    }
  };

  // בחירת ילד אקראי לתגובה
  const selectRandomChild = () => {
    if (!lesson.participants || lesson.participants.length === 0) return null;

    const availableChildren = lesson.participants.filter(child => 
      session?.currentSpeaker !== child._id
    );
    
    if (availableChildren.length > 0) {
      const randomChild = availableChildren[Math.floor(Math.random() * availableChildren.length)];
      updateSession({ currentSpeaker: randomChild._id });
      socketService.changeSpeaker(sessionId, randomChild._id);
      return randomChild;
    }
    return null;
  };

  // תגובה של ילד (סימולציה)
  const simulateChildResponse = async () => {
    const child = selectRandomChild();
    if (!child) return;

    // Simple demo responses
    const responses = [
      "איזה רעיון מעניין!",
      "אני חושב שזה נכון!",
      "יש לי רעיון אחר...",
      "בואו ננסה את זה!",
      "אני מסכים!"
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];

    setTimeout(() => {
      addMessage(child._id, child.name, response, "child");
      
      // איפוס הדובר הנוכחי אחרי תגובה
      setTimeout(() => {
        updateSession({ currentSpeaker: null });
      }, 1000);
    }, 1000 + Math.random() * 2000); // תגובה אחרי 1-3 שניות
  };

  // תגובת AI חכמה לילדים
  const generateAIResponse = async () => {
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

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">טוען סשן...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">שגיאה בטעינת הסשן</p>
          <Button onClick={onEndLesson}>חזור</Button>
        </div>
      </div>
    );
  }

  const currentStep = lesson.steps && lesson.steps[session.currentStep];
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
                    disabled={!session.isActive || !lesson.participants || lesson.participants.length === 0}
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
                    disabled={!session.isActive || !lesson.steps || session.currentStep >= lesson.steps.length - 1}
                    size="sm"
                  >
                    שלב הבא
                  </Button>
                  <Button 
                    onClick={moveToNextStep}
                    disabled={!session.isActive || !lesson.steps || session.currentStep >= lesson.steps.length - 1}
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
                  {session.messages && session.messages.map((message) => (
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
            participants={lesson.participants || []}
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