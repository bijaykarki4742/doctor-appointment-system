import { cn } from "@/components/lib/utils"
import { Clock } from "lucide-react"

export function TimeSlots({ selectedTime, onSelectTime, disabled = false }) {
  // Generate time slots with start/end times
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour <= 17; hour++) {
      const hour24 = hour < 10 ? `0${hour}` : hour
      const hour12 = hour % 12 === 0 ? 12 : hour % 12
      const period = hour < 12 ? "AM" : "PM"

      // Full hour slot
      slots.push({
        display: `${hour12}:00 ${period}`,
        start: `${hour24}:00`,
        end: hour < 17 ? `${hour24}:30` : `${hour24}:00` // Last slot ends at full hour
      })

      // Half hour slot (except last hour)
      if (hour < 17) {
        slots.push({
          display: `${hour12}:30 ${period}`,
          start: `${hour24}:30`,
          end: hour < 16 ? `${hour+1}:00` : `${hour24}:30` // Handle last slot
        })
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {timeSlots.map((slot) => (
          <button
            key={slot.display}
            type="button"
            className={cn(
              "flex items-center justify-center rounded-md border px-3 py-2 text-sm",
              selectedTime?.display === slot.display
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input hover:bg-accent hover:text-accent-foreground",
              disabled && "pointer-events-none opacity-50",
            )}
            onClick={() => onSelectTime(slot)}
            disabled={disabled}
          >
            <Clock className="mr-1 h-3 w-3" />
            {slot.display}
          </button>
        ))}
      </div>
    </div>
  )
}