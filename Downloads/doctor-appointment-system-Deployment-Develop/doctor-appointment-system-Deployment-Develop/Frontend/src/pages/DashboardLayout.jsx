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
            <div className="flex flex-row min-h-screen bg-gray-50">
                <AppSidebar />
                <div className="flex flex-col flex-1 w-full">
                    <div className="w-full max-w-6xl mx-auto flex flex-col flex-1 min-h-screen">
                        <Header user={user} />
                        <main className="flex-1 w-full px-8 py-8">
                            <Outlet />
                        </main>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    )
}
