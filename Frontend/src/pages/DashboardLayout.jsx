import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "../containers/dashboard/app-sidebar"
import { Header } from "../containers/dashboard/header"
import { Outlet } from "react-router-dom"

export function DashboardLayout() {
    const user = {
        name: "Administrator",
        specialty: "Admin",
        image: "/placeholder.svg?height=32&width=32",
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col h-screen bg-gray-50">
                    <Header user={user} />
                    <main className="flex-1 p-6 overflow-auto">
                        <Outlet />
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
