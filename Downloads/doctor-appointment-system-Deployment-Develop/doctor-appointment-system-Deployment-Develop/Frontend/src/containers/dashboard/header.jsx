import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header({ user }) {
  return (
    <div className="flex items-center justify-between p-3 border-b">
      <div className="relative w-1/3">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search patients, appointments..." className="pl-8 h-9" />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          {/*<Bell className="h-5 w-5" />*/}
          {/*<span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>*/}
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
          <div>
            <div className="text-sm font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.specialty}</div>
          </div>
        </div>
      </div>
    </div>
  )
}


