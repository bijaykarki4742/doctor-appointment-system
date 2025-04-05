import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export function TopDoctors({ doctors }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Doctors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {doctors.map((doctor, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={doctor.image} alt={doctor.name} />
                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{doctor.name}</div>
                <div className="text-sm text-muted-foreground">{doctor.specialty}</div>
              </div>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1">{doctor.rating}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

