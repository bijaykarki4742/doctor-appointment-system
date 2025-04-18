import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentMessages({ messages }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Recent Messages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="flex items-start gap-3">
            <Avatar>
              <AvatarImage src={message.senderImage} alt={message.sender} />
              <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{message.sender}</div>
              <div className="text-sm text-muted-foreground line-clamp-1">{message.content}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

