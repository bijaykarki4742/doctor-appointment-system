import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Calendar, X } from "lucide-react"

export function RecentActivity({ activities }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case "new-patient":
        return (
          <div className="p-2 rounded-full bg-blue-100">
            <User className="h-4 w-4 text-blue-600" />
          </div>
        )
      case "confirmed":
        return (
          <div className="p-2 rounded-full bg-green-100">
            <Calendar className="h-4 w-4 text-green-600" />
          </div>
        )
      case "cancelled":
        return (
          <div className="p-2 rounded-full bg-red-100">
            <X className="h-4 w-4 text-red-600" />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3">
            {getActivityIcon(activity.type)}
            <div>
              <div className="font-medium">{activity.title}</div>
              <div className="text-sm text-muted-foreground">{activity.time}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

