import { Child } from "@/types/lesson";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ParticipantListProps {
  participants: Child[];
  currentSpeaker: string | null;
  aiSpeaking: boolean;
}

export const ParticipantList = ({ participants, currentSpeaker, aiSpeaking }: ParticipantListProps) => {
  return (
    <div className="bg-card p-4 rounded-lg border">
      <h3 className="font-bold text-lg mb-4 text-foreground">משתתפים בשיעור</h3>
      
      {/* מנחה AI */}
      <div className={`flex items-center gap-3 p-3 rounded-lg mb-3 transition-all ${
        aiSpeaking ? 'bg-ai-secondary border-2 border-ai-primary' : 'bg-ai-secondary/30'
      }`}>
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-ai-primary text-white text-sm">
            🤖
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium text-sm text-ai-foreground">מנחה AI</p>
          <p className="text-xs text-ai-foreground/70">מדריך השיעור</p>
        </div>
        {aiSpeaking && (
          <Badge variant="secondary" className="bg-ai-primary text-white">
            מדבר כעת
          </Badge>
        )}
      </div>
      
      {/* רשימת ילדים */}
      <div className="space-y-2">
        {participants.map((child) => (
          <div 
            key={child.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              currentSpeaker === child.id 
                ? 'bg-secondary border-2 border-primary' 
                : 'bg-secondary/30 hover:bg-secondary/50'
            }`}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={child.avatar} alt={child.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {child.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-sm text-foreground">{child.name}</p>
              <p className="text-xs text-muted-foreground">{child.personality}</p>
            </div>
            {currentSpeaker === child.id && (
              <Badge variant="default">
                התור שלו
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};