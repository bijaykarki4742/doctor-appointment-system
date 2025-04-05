import { cn } from '@/components/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import React from 'react'

const MiniDoctorCard = ({ doctor, selected, onSelect }) => {
    return (
        <>
            <Card
                className={cn("cursor-pointer transition-all hover:border-primary", selected && "border-primary bg-primary/5")}
                onClick={onSelect}
            >
                <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-full">
                            <img
                                src={doctor.image || "/placeholder.svg"}
                                alt={doctor.name}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium">{doctor.name}</h3>
                            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                            <div className="mt-1 flex items-center">
                                <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
                                <span className="text-sm">{doctor.rating}</span>
                                <span className="mx-2 text-muted-foreground">•</span>
                                <span className="text-sm text-muted-foreground">{doctor.experience}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default MiniDoctorCard
