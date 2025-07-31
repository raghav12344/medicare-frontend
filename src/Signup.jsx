import React, { useState } from 'react';
import * as Yup from 'yup';
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaTint,
  FaUserInjured,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import { server_url } from './config/url';

const userTypes = [
  { label: 'Donor', value: 'donor', icon: <FaTint className="text-red-500 mr-2" /> },
  { label: 'Receiver', value: 'receiver', icon: <FaUserInjured className="text-green-500 mr-2" /> },
];

const passwordConditions = [
  { label: 'At least 8 characters', regex: /.{8,}/ },
  { label: 'At least one uppercase letter', regex: /[A-Z]/ },
  { label: 'At least one lowercase letter', regex: /[a-z]/ },
  { label: 'At least one number', regex: /\d/ },
  { label: 'At least one special character (@$!%*?&#^+=)', regex: /[@$!%*?&#^+=]/ },
];

const schema = Yup.object().shape({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Must be at least 8 characters')
    .matches(/[A-Z]/, 'Must include at least one uppercase letter')
    .matches(/[a-z]/, 'Must include at least one lowercase letter')
    .matches(/\d/, 'Must include at least one number')
    .matches(/[@$!%*?&#^+=]/, 'Must include at least one special character'),
  userType: Yup.string().required('User type is required'),
});

const getPasswordStrength = (password) => {
  const conditions = [
    /.{8,}/,
    /[A-Z]/,
    /[a-z]/,
    /\d/,
    /[@$!%*?&#^+=]/,
  ];

  const score = conditions.reduce((acc, regex) => acc + regex.test(password), 0);

  if (score >= 5) return { label: 'Strong', color: 'bg-green-500', score: 100 };
  if (score >= 3) return { label: 'Medium', color: 'bg-yellow-400', score: 60 };
  if (score >= 1) return { label: 'Weak', color: 'bg-red-400', score: 30 };
  return { label: '', color: 'bg-gray-200', score: 0 };
};

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: '',
  });

  const [errors, setErrors] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const passwordStrength = getPasswordStrength(formData.password);
  const fulfilledConditions = passwordConditions.map(({ regex }) => regex.test(formData.password));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // clear error on change
  };

  const handleUserTypeSelect = (value) => {
    setFormData((prev) => ({ ...prev, userType: value }));
    setErrors((prev) => ({ ...prev, userType: '' }));
    setDropdownOpen(false);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {
      await schema.validate(formData, { abortEarly: false });
      (async function senddata(){
        let url=server_url + "/user/signup";
        // alert(url);
        let resp=await axios.post(url,formData,{headers:{"Content-Type":"application/x-www-form-urlencoded"}})
        if(resp.data.status==true)
        {
          alert(resp.data.msg);
          alert("please login to continue");
        }
        else
          alert(resp.data.msg);
      })();
      setErrors({});
    } catch (validationError) {
      const newErrors = {};
      validationError.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  const selectedUserType = userTypes.find((u) => u.value === formData.userType);
 
  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-blue-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-xl px-8 py-10 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Sign Up to Medicose</h2>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Full Name */}
          <div className="relative">
            <FaUser className="absolute left-3 top-3.5 text-blue-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3.5 text-blue-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3.5 text-blue-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

            {/* Password Strength */}
            {formData.password && (
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Password Strength:</span>
                  <span className={`font-semibold ${passwordStrength.color.replace('bg', 'text')}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded mb-3">
                  <div
                    className={`h-2 rounded transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.score}%` }}
                  ></div>
                </div>

                {/* Password Condition Checklist */}
                <ul className="text-sm space-y-1">
                  {passwordConditions.map(({ label }, idx) => (
                    <li key={label} className="flex items-center">
                      {fulfilledConditions[idx] ? (
                        <FaCheckCircle className="text-green-500 mr-2" />
                      ) : (
                        <FaTimesCircle className="text-red-500 mr-2" />
                      )}
                      <span className={fulfilledConditions[idx] ? 'text-green-700' : 'text-red-600'}>
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* User Type Dropdown */}
          <div className="relative">
            <div
              className="w-full flex items-center justify-between px-4 py-2 border rounded-lg bg-white cursor-pointer hover:border-blue-400 transition"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              tabIndex={0}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 150)} // delay so click registers
            >
              <div className="flex items-center text-gray-700">
                {selectedUserType?.icon || <FaUser className="mr-2 text-blue-400" />}
                {selectedUserType?.label || 'Select User Type'}
              </div>
              <span className="text-blue-400">&#x25BC;</span>
            </div>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-auto"
                >
                  {userTypes.map((user) => (
                    <li
                      key={user.value}
                      onClick={() => handleUserTypeSelect(user.value)}
                      className="px-4 py-2 flex items-center hover:bg-blue-100 cursor-pointer"
                    >
                      {user.icon}
                      {user.label}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>

            {errors.userType && <p className="text-red-500 text-sm mt-1">{errors.userType}</p>}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Create Account
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
