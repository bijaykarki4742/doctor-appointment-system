import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { DashboardLayout } from "@/pages/DashboardLayout.jsx"
import Dashboard from "./pages/dashboard"
import {AppointmentsTable} from "@/containers/dashboard/appointments-table.jsx"
import Patients from "@/containers/dashboard/patients.jsx"
// import Messages from "./pages/messages"
// import Reports from "./pages/reports"
// import Settings from "./pages/settings"

const router = createBrowserRouter([
    {
        path: "/",
        element: <DashboardLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "appointments",
                element: <AppointmentsTable />,
            },
            {
                path: "patients",
                element: <Patients />,
            },
            // {
            //     path: "messages",
            //     element: <Messages />,
            // },
            // {
            //     path: "reports",
            //     element: <Reports />,
            // },
            // {
            //     path: "settings",
            //     element: <Settings />,
            // },
        ],
    },
])

function App() {
    return <RouterProvider router={router} />
}

export default App
