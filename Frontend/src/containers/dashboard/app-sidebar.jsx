import { LayoutDashboard, Calendar, Users, MessageSquare, BarChart3, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { useUserRole } from "@/Contexts/UserContext";

export function AppSidebar({ ...props }) {
  const location = useLocation();
  const { role, loading } = useUserRole();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Calendar, label: "Appointments", path: "/admin/appointments" },
    // Only show these if role is 'admin'
    ...(role === "admin"
        ? [
          { icon: Users, label: "Patients", path: "/admin/patients" },
          { icon: MessageSquare, label: "Doctors", path: "/Doctor" },
        ]
        : []),
    { icon: BarChart3, label: "Profile", path: "/Userprofile" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  if (loading) return null; // or show a loader while fetching role

  return (
    <Sidebar {...props} className="border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarHeader className="px-4 py-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
              <Link to="/" className="flex items-center gap-3">
                <img 
                  src="public/EasyCare.png" 
                  className="w-10 h-10 rounded-lg border" 
                  alt="EasyCare Logo" 
                />
                <span className="text-lg font-semibold">EasyCare</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton 
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start ${isActive ? "font-medium" : ""}`}
                >
                  <Link to={item.path} className="flex items-center">
                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
