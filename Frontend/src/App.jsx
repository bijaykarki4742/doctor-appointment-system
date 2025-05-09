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
import VideoCall from "@/containers/VideoCall.jsx";
import { UserProvider } from "@/Contexts/UserContext.jsx";
import ProtectedRoute from "@/containers/ProtectedRoute.jsx";
import { Toaster } from "react-hot-toast"

function App() {
    return (
        <AuthProvider>
            <UserProvider>
                {/* Add Toaster component here */}
                <Toaster
                    position="top-center"
                    gutter={12}
                    containerStyle={{ margin: "8px" }}
                    toastOptions={{
                        success: {
                            duration: 3000,
                            style: {
                                background: '#10b981',
                                color: '#fff',
                            },
                        },
                        error: {
                            duration: 5000,
                            style: {
                                background: '#ef4444',
                                color: '#fff',
                            },
                        },
                        loading: {
                            duration: 5000,
                            style: {
                                background: '#f3f4f6',
                                color: '#4b5563',
                            },
                        },
                    }}
                />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/profile" element={<DrProfile />} />
                    <Route path="/contactUs" element={<Contactus />} />
                    <Route path="/DoctorList" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'patient', null]}><DoctorList /></ProtectedRoute>} />
                    <Route path="/Userprofile" element={<ProfileSettings />} />
                    <Route path="/bookDoctor" element={<BookDoctor />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/videoCall/:roomId" element={<VideoCall />} />

                    {/* Dashboard Layout nested routes */}
                    <Route path="/admin" element={<DashboardLayout />}>
                        <Route path="appointments" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'patient']}> <AppointmentsTable /></ProtectedRoute>} />
                        <Route path="Userprofile" element={<ProfileSettings />} />
                        <Route path="patients" element={<ProtectedRoute allowedRoles={['admin', 'doctor']}><PatientsPage /> </ProtectedRoute>} />
                        <Route path="dashboard" element={<Dashboard />} />
                    </Route>
                </Routes>
            </UserProvider>
        </AuthProvider>
    )
}

export default App
