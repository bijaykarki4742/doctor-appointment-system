import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import { AuthProvider } from "./Contexts/AuthContext"
import DrProfile from "./pages/DrProfile"
import Contactus from "@/pages/Contactus.jsx"
import DoctorList from "@/containers/DoctorList.jsx"
import BookDoctor from "./pages/BookDoctor"
import Dashboard from "./pages/Dashboard"
import ProfileSettings from "@/containers/Profile/ProfileSettings.jsx"
import { AppointmentsTable } from "@/containers/dashboard/appointments-table.jsx"
import PatientsPage from "@/containers/dashboard/patients.jsx"
import { DashboardLayout } from "@/pages/DashboardLayout.jsx"
import { Outlet } from "react-router-dom"
import VideoCall from "@/containers/VideoCall.jsx";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<DrProfile />} />
                <Route path="/contactUs" element={<Contactus />} />
                <Route path="/DoctorList" element={<DoctorList />} />
                <Route path="/bookDoctor" element={<BookDoctor />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/Userprofile" element={<ProfileSettings />} />
                <Route path="/videoCall/:roomId" element={<VideoCall />} />



                {/* Dashboard Layout nested routes */}
                <Route path="/admin" element={<DashboardLayout />}>
                    <Route path="appointments" element={<AppointmentsTable />} />
                    <Route path="patients" element={<PatientsPage />} />
                    <Route path="dashboard" element={<Dashboard />} />
                </Route>
            </Routes>
        </AuthProvider>
    )
}

export default App
