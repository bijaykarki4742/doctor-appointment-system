import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Box, 
  ShoppingCart, 
  Users, 
  Brush, 
  BarChart2, 
  Share2, 
  Settings 
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"

export function AppSidebar({ ...props }) {
  const location = useLocation()
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Patients", path: "/admin/patients" },
    { icon: CreditCard, label: "Appointments", path: "/admin/appointTable" },
    { icon: Users, label: "Customers", path: "/customers" },
    { icon: BarChart2, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ]

  return (
    <Sidebar {...props} className="border-r bg-background w-64 h-full fixed">
      <SidebarHeader className="px-6 py-6 border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent px-0">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">US</span>
                </div>
                <span className="text-lg font-bold">UScreen</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4">
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path !== "/" && location.pathname.startsWith(item.path))
            return (
              <SidebarMenuItem key={item.label} className="mb-1">
                <SidebarMenuButton 
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start rounded-lg transition-all ${
                    isActive 
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium" 
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Link to={item.path} className="flex items-center py-3 px-3">
                    <item.icon className={`mr-3 h-5 w-5 ${
                      isActive ? "text-blue-600" : "text-gray-500"
                    }`} />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-blue-600" />
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