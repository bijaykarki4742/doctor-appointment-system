import { Card, CardContent } from "@/components/ui/card"

export function StatCard({ icon, title, value, period, color }) {
  const Icon = icon

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <div className={`p-2 rounded-lg ${color} mr-3`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="text-sm text-muted-foreground">{period}</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground">{title}</div>
        </div>
      </CardContent>
    </Card>
  )
}

