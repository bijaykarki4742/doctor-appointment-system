import { Calendar, CheckCircle, Clock } from "lucide-react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "../containers/dashboard/app-sidebar"
import { StatCard } from "../containers/dashboard/stat-card"
import { AppointmentsTable } from "../containers/dashboard/appointments-table"
import { RecentMessages } from "../containers/dashboard/recent-messages"
import { Header } from "../containers/dashboard/header"

export default function Dashboard() {
  // Mock data
  const user = {
    name: "Dr. John Smith",
    specialty: "Cardiologist",
    image: "/placeholder.svg?height=32&width=32",
  }

  const stats = [
    {
      icon: Calendar,
      title: "Total Appointments",
      value: "24",
      period: "This Week",
      color: "bg-blue-500",
    },
    {
      icon: Clock,
      title: "Upcoming Appointments",
      value: "5",
      period: "Today",
      color: "bg-green-500",
    },
    {
      icon: CheckCircle,
      title: "Completed Consultations",
      value: "18",
      period: "Today",
      color: "bg-purple-500",
    },
  ]

  const appointments = [
    {
      id: 1,
      patientName: "Michael Brown",
      patientImage: "/placeholder.svg?height=32&width=32",
      time: "09:00 AM",
      reason: "General Checkup",
      status: "Upcoming",
      action: "Start",
    },
    {
      id: 2,
      patientName: "Sarah Wilson",
      patientImage: "/placeholder.svg?height=32&width=32",
      time: "10:30 AM",
      reason: "Follow-up",
      status: "Completed",
      action: "View",
    },
  ]

  const messages = [
    {
      sender: "Emma Davis",
      senderImage: "/placeholder.svg?height=40&width=40",
      content: "Thank you for the prescription...",
    },
    {
      sender: "James Wilson",
      senderImage: "/placeholder.svg?height=40&width=40",
      content: "When should I come for...",
    },
  ]

  return (
        <div className="flex flex-col h-full bg-gray-50">
          <main className="flex-1 p-6 overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <AppointmentsTable appointments={appointments} />
              </div>
              <div>
                <RecentMessages messages={messages} />
              </div>
            </div>
          </main>
        </div>
  )
}

