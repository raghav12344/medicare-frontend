import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet,useNavigate } from "react-router-dom";
export default function CleanNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navg=useNavigate();
  function donavg(url)
  {
    navg("/"+url);
  }
  return (
    <>
    <nav className="fixed w-full z-20 top-0 bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-extrabold text-blue-600 cursor-pointer tracking-wide"
        >
          Medicose
        </motion.h1>

        {/* Desktop Menu */}
        <motion.div
          className="hidden md:flex items-center space-x-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <ul className="flex space-x-8 text-gray-700 font-medium">
            <li className="hover:text-blue-500 transition duration-300 cursor-pointer" ><a href="/">Home</a></li>
            <li className="hover:text-blue-500 transition duration-300 cursor-pointer"><a href="#about">About</a></li>
            <li className="hover:text-blue-500 transition duration-300 cursor-pointer"><a href="#services">Services</a></li>
            <li className="hover:text-blue-500 transition duration-300 cursor-pointer"><a href="#contact">Contact</a></li>
          </ul>
          {/* Login & Sign Up Buttons */}
          <div className="space-x-3">
            <motion.button
              whileTap={{ scale: 0.85 }}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition duration-300"
              onClick={()=>{donavg("login")}}
            >
              Login
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={()=>{donavg("signup")}}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 transition duration-300"
            >
              Sign Up
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <motion.svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              initial={{ rotate: 0 }}
              animate={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              initial={{ rotate: 0 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </motion.svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200 overflow-hidden"
          >
            <ul className="px-4 py-2 text-gray-700 font-medium">
              <li className="block px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={()=>{donavg("")}}>Home</li>
              <li className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">About</li>
              <li className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Services</li>
              <li className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Contact</li>
            </ul>
            <div className="px-4 pb-4 space-y-2">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={()=>{donavg("login")}}
                className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition duration-300"
              >
                Login
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={()=>{donavg("signup")}}
                className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 transition duration-300"
              >
                Sign Up
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    <Outlet></Outlet>
    </>
  );
}
