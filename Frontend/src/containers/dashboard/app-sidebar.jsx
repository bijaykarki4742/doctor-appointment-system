import { LayoutDashboard, Calendar, Users, MessageSquare, BarChart3, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }) {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/", active: true },
    { icon: Calendar, label: "Appointments", path: "/appointments" },
    { icon: Users, label: "Patients", path: "/patients" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: BarChart3, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ]

  return (
    <Sidebar {...props}>
      <SidebarHeader className="pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/" className="flex items-center">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <span className="font-bold">M</span>
                </div>
                <div className="ml-2 font-semibold text-lg">MediDash</div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild isActive={item.active}>
                <a href={item.path} className="flex items-center">
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

