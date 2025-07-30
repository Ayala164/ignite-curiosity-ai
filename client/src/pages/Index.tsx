import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { LessonInterface } from "@/components/LessonInterface";
import { mockLesson } from "@/data/mockData";

const Index = () => {
  const [isLessonStarted, setIsLessonStarted] = useState(false);

  const handleStartLesson = () => {
    setIsLessonStarted(true);
  };

  const handleEndLesson = () => {
    setIsLessonStarted(false);
  };

  if (isLessonStarted) {
    return (
      <LessonInterface 
        lesson={mockLesson} 
        onEndLesson={handleEndLesson}
      />
    );
  }

  return (
    <WelcomeScreen 
      lesson={mockLesson}
      onStartLesson={handleStartLesson}
    />
  );
};

export default Index;
