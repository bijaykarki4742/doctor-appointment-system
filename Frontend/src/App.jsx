import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home";
import About from './pages/About';
import Signup from './pages/Signup';
import Login from "./pages/Login";
import { AuthProvider } from './Contexts/AuthContext';
import DrProfile from './pages/DrProfile';
import Contactus from "@/pages/Contactus.jsx";
import DoctorList from "@/containers/DoctorList.jsx";
import BookDoctor from './pages/BookDoctor';
import Dashboard from './pages/Dashboard';
function App() {

    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />}></Route>
                <Route path="/signup" element={<Signup />}></Route>
                {/* <Route path="/doctorprofile" element={<DoctorProfile />}></Route> */}
                <Route path="/profile" element={<DrProfile />} ></Route>
                <Route path="/contactUs" element={<Contactus />}></Route>
                <Route path="/DoctorList" element={<DoctorList />}></Route>
                <Route path="/bookDoctor" element={<BookDoctor />}></Route>
                <Route path="/dashboard" element={<Dashboard />}></Route>

            </Routes>
        </AuthProvider>
    )
}

export default App
