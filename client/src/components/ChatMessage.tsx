import { Message } from "@/types/lesson";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageProps {
  message: Message;
  isAI?: boolean;
}

export const ChatMessage = ({ message, isAI = false }: ChatMessageProps) => {
  return (
    <div className={`flex gap-3 p-4 ${isAI ? 'bg-ai-secondary/20' : 'bg-child-message/30'} rounded-lg`}>
      <Avatar className="w-10 h-10">
        <AvatarImage 
          src={isAI ? "/api/placeholder/40/40" : "/api/placeholder/40/40"} 
          alt={message.senderName} 
        />
        <AvatarFallback className={isAI ? 'bg-ai-primary text-white' : 'bg-secondary'}>
          {message.senderName.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-medium text-sm ${isAI ? 'text-ai-foreground' : 'text-child-foreground'}`}>
            {message.senderName}
          </span>
          {isAI && (
            <span className="px-2 py-1 bg-ai-primary text-white text-xs rounded-full">
              🤖 מנחה
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString('he-IL', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        
        <p className={`text-sm ${isAI ? 'text-ai-foreground' : 'text-child-foreground'}`}>
          {message.content}
        </p>
        
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1 mt-2">
            {message.reactions.map((reaction, index) => (
              <span key={index} className="text-lg">
                {reaction}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};