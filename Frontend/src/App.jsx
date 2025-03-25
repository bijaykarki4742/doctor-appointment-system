import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home";
import About from './pages/About';
import Signup from './pages/Signup';
import  Login from "./pages/Login";

function App() {

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/signup" element={<Signup />}></Route>
        </Routes>
    )
}

export default App
