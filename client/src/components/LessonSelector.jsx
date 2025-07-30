import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Clock, Sparkles } from "lucide-react";

export const LessonSelector = ({ lessons, onLessonSelect }) => {
  if (!lessons || lessons.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light/20 to-secondary/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle>אין שיעורים זמינים</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              לא נמצאו שיעורים במערכת. אנא צור קשר עם המנהל להוספת שיעורים.
            </p>
            <Button onClick={() => window.location.reload()}>
              רענן דף
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/20 to-secondary/30 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            פלטפורמת הלמידה החכמה
          </h1>
          <p className="text-xl text-muted-foreground">
            בחר שיעור להתחיל את ההרפתקה החינוכית
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <Card key={lesson._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{lesson.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-3">
                      {lesson.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {lesson.subject}
                  </Badge>
                  <Badge variant="outline">
                    גיל {lesson.targetAge}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{lesson.participants?.length || 0} משתתפים</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {lesson.steps?.reduce((total, step) => total + (step.duration || 5), 0) || 30} דק׳
                    </span>
                  </div>
                </div>

                {lesson.steps && lesson.steps.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">שלבי השיעור:</p>
                    <div className="space-y-1">
                      {lesson.steps.slice(0, 3).map((step, index) => (
                        <div key={step.id} className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-center text-xs leading-4">
                            {index + 1}
                          </span>
                          {step.title}
                        </div>
                      ))}
                      {lesson.steps.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          ועוד {lesson.steps.length - 3} שלבים...
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Button 
                  onClick={() => onLessonSelect(lesson)}
                  className="w-full"
                >
                  בחר שיעור זה
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};