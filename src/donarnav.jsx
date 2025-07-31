import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function DonorNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navg=useNavigate()
  function donavg(url)
  {
    navg("/"+url);
  }
  const navLinks = [
    { name: "Dashboard", href: "/donar" }
  ];

  // Fetch email from localStorage on component mount
  useEffect(() => {
    const email = localStorage.getItem("activeUser");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  return (
    <>
      <nav className="bg-[#0f172a] text-[#f1f5f9] shadow-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Show Email Instead of Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-semibold cursor-pointer text-[#38bdf8]"
            >
              {userEmail || "Guest"} {/* Show 'Guest' if email not available */}
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  whileHover={{ scale: 1.1 }}
                  className="hover:text-[#fbbf24] transition duration-300"
                >
                  {link.name}
                </motion.a>
              ))}
              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#38bdf8] text-[#0f172a] px-4 py-2 rounded-lg font-semibold hover:bg-[#fbbf24] transition"
                onClick={()=>{
                if(confirm("Do U want to logout"))
                {
                  localStorage.removeItem("activeUser");
                  localStorage.removeItem("token");
                  donavg("");
                }
              }}
              >
                Logout
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={28} color="#f1f5f9" /> : <Menu size={28} color="#f1f5f9" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#1e293b]"
          >
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="block px-4 py-2 hover:bg-[#0f172a] transition"
              >
                {link.name}
              </a>
            ))}
            {/* Mobile Logout Button */}
            <div className="px-4 py-2">
              <button className="w-full bg-[#38bdf8] text-[#0f172a] px-4 py-2 rounded-lg font-semibold hover:bg-[#fbbf24] transition" onClick={()=>{
                if(confirm("Do U want to logout"))
                {
                  localStorage.removeItem("activeUser");
                  localStorage.removeItem("token");
                  donavg("");
                }
              }}>
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </nav>
      <Outlet />
    </>
  );
}
