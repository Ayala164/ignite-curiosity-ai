import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lesson } from "@/types/lesson";
import { Users, Clock, BookOpen, Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  lesson: Lesson;
  onStartLesson: () => void;
}

export const WelcomeScreen = ({ lesson, onStartLesson }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/20 to-secondary/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              ברוכים הבאים לשיעור!
            </h1>
            <h2 className="text-2xl font-semibold text-primary mb-3">
              {lesson.title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {lesson.description}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* פרטי השיעור */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
              <BookOpen className="w-6 h-6 text-primary" />
              <div>
                <p className="font-medium text-sm text-foreground">נושא</p>
                <p className="text-sm text-muted-foreground">{lesson.subject}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg">
              <Users className="w-6 h-6 text-secondary-foreground" />
              <div>
                <p className="font-medium text-sm text-foreground">משתתפים</p>
                <p className="text-sm text-muted-foreground">{lesson.participants.length} ילדים</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-accent/20 rounded-lg">
              <Clock className="w-6 h-6 text-accent-foreground" />
              <div>
                <p className="font-medium text-sm text-foreground">משך</p>
                <p className="text-sm text-muted-foreground">
                  {lesson.steps.reduce((total, step) => total + (step.duration || 5), 0)} דקות
                </p>
              </div>
            </div>
          </div>

          {/* רשימת המשתתפים */}
          <div>
            <h3 className="font-bold text-lg mb-3 text-foreground">משתתפי השיעור</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {lesson.participants.map((child, index) => (
                <div key={child.id} className="flex items-center gap-2 p-3 bg-card border rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{child.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{child.personality}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* תוכן השיעור */}
          <div>
            <h3 className="font-bold text-lg mb-3 text-foreground">מהלך השיעור</h3>
            <div className="space-y-2">
              {lesson.steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Badge variant="outline" className="shrink-0">
                    {index + 1}
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                  {step.duration && (
                    <Badge variant="secondary" className="text-xs">
                      {step.duration} דק׳
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* כפתור התחלה */}
          <div className="text-center pt-4">
            <Button 
              onClick={onStartLesson}
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all"
            >
              🚀 בואו נתחיל את השיעור!
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              לחצו כדי להתחיל את ההרפתקה החינוכית שלנו
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};