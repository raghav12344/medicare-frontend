import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { server_url } from './config/url';

const Login = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error as user types
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  // Basic email format validation
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Proceed with valid data
    async function senddata(){
      let url=server_url + "/user/login";
      let resp=await axios.post(url,formData,{headers:{"Content-Type":"application/x-www-form-urlencoded"}})
      if(resp.data.status==true)
      {
        alert(resp.data.msg);
        // alert(resp.data.token);
        // alert(resp.data.obj.userType)
        localStorage.setItem("activeUser",resp.data.obj.email);
        localStorage.setItem("token",resp.data.token);
        if(resp.data.obj.userType==="donor")
          navigate("/donar");
        if(resp.data.obj.userType==="receiver")
          navigate("/needy");
      }
      else
        alert(resp.data.msg);
    }
    senddata()
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-blue-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-xl px-8 py-10 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Login to Medicos</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3.5 text-blue-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={`w-full pl-10 pr-4 py-2 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? 'focus:ring-red-400' : 'focus:ring-blue-400'
              }`}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1 ml-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3.5 text-blue-400" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={`w-full pl-10 pr-4 py-2 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? 'focus:ring-red-400' : 'focus:ring-blue-400'
              }`}
              required
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1 ml-1">{errors.password}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Login
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
