import { useState, useEffect } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { LessonInterface } from "@/components/LessonInterface";
import { LessonSelector } from "@/components/LessonSelector";
import { useLessons } from "@/hooks/useAPI";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [currentView, setCurrentView] = useState('selector'); // 'selector', 'welcome', 'lesson'
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const { lessons, loading, error } = useLessons();
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון את השיעורים. אנא נסה שוב.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
    setCurrentView('welcome');
  };

  const handleStartLesson = async () => {
    try {
      // Create a new session for the lesson
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId: selectedLesson._id,
          participants: selectedLesson.participants || []
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const session = await response.json();
      setSessionId(session._id);
      setCurrentView('lesson');
    } catch (error) {
      console.error('Error starting lesson:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן להתחיל את השיעור. אנא נסה שוב.",
        variant: "destructive"
      });
    }
  };

  const handleEndLesson = () => {
    setCurrentView('selector');
    setSelectedLesson(null);
    setSessionId(null);
  };

  const handleBackToSelector = () => {
    setCurrentView('selector');
    setSelectedLesson(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">טוען שיעורים...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'lesson' && selectedLesson && sessionId) {
    return (
      <LessonInterface 
        lesson={selectedLesson} 
        sessionId={sessionId}
        onEndLesson={handleEndLesson}
      />
    );
  }

  if (currentView === 'welcome' && selectedLesson) {
    return (
      <WelcomeScreen 
        lesson={selectedLesson}
        onStartLesson={handleStartLesson}
        onBack={handleBackToSelector}
      />
    );
  }

  return (
    <LessonSelector 
      lessons={lessons}
      onLessonSelect={handleLessonSelect}
    />
  );
};

export default Index;