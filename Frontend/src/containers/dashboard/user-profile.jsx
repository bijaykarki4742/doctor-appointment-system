import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UserProfile({ user }) {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon">
        <Bell className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="text-sm font-medium">{user.name}</div>
      </div>
    </div>
  )
}

