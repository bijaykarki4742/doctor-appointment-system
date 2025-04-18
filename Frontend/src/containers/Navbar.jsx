import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/Contexts/AuthContext";

// Define your navigation links
const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  // { name: "Profile", path: "/profile" },
  { name: "Contact", path: "/contactus" },
  { name: "Doctor List", path: "/DoctorList" },
  { name: "Profile", path: "/Userprofile" },
];

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-10 top-0 left-0">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          Easy Care
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-gray-700 hover:text-blue-600"
            >
              {link.name}
            </Link>
          ))}


          <div className="flex items-center space-x-2">
            {token ? (
              <>
                <span className="text-gray-700">Welcome, {user?.name || user?.email}</span>
                <Button onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="link"
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md py-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <div className="px-4 py-2">
            {token ? (
              <>
                <div className="text-gray-700 py-2">
                  Welcome, {user?.name || user?.email}
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full mb-2"
                  asChild
                >
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                </Button>
                <Button
                  className="w-full"
                  asChild
                >
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
