import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaStar } from 'react-icons/fa';
import axios from 'axios';
import { server_url } from './config/url';

const UserDetailsForm = () => {
  const initialData = {
    email: '',
    name: '',
    age: '',
    gender: '',
    address: '',
    city: '',
    contact: '',
    qualification: '',
    qualificationRating: '',
    occupation: '',
    aadhaarPic: null,
    profilePic: null,
  };
  useEffect(()=>{
    const email=localStorage.getItem("activeUser");
    setFormData({...formData,email})
  },[]);
  const [formData, setFormData] = useState(initialData);
  const [preview, setPreview] = useState({ aadhaarPic: null, profilePic: null });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreview((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
    } else if (name === 'qualification') {
      const rating = getEducationRating(value);
      setFormData((prev) => ({
        ...prev,
        qualification: value,
        qualificationRating: rating,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const token=localStorage.getItem("token");
  const handleFetch = async () => {
    let url=server_url + "/donar/fetchdetails";
    let resp=await axios.post(url,formData,{headers:{"Content-Type":"application/x-www-form-urlencoded",'authorization':`Bearer ${token}`}})
    if (resp.data.obj!=null) {

      setFormData(resp.data.obj);
      alert(resp.data.msg);
      setPreview({ aadhaarPic: resp.data.obj.aadhaarPic, profilePic: resp.data.obj.profilePic});
    } else {
      alert('No user found with this email.');
    }
  };

const handleSave = async () => {
  let obj=new FormData()
  for (let prop in formData)
    obj.append(prop,formData[prop]);
  let url=server_url + "/donar/postdonarDetails"
  let resp=await axios.post(url,obj,{headers:{"Content-Type":"multipart/form-data",'authorization':`Bearer ${token}`}})
  if(resp.data.status==true)
    alert(resp.data.msg);
  else
    alert(resp.data.msg);
};

  const handleUpdate = async () => {
    let url=server_url + "/donar/update";
    let obj=new FormData();
    for(let prop in formData)
      obj.append(prop,formData[prop]);
    let resp=await axios.post(url,obj,{headers:{"Content-Type":"multipart/form-data",'authorization':`Bearer ${token}`}})
    if(resp.data.status==true)
      alert(resp.data.msg);
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-10 pt-30 "
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-8">
        Medical User Profile
      </h2>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
        {/* Email & Fetch */}
        <div className="col-span-2 flex flex-col md:flex-row items-end gap-4">
          <div className="w-full">
            <label className="text-gray-600 font-semibold">Email ID</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              readOnly
              className="w-full px-4 py-2 border rounded-lg text-gray-500 bg-gray-100 focus:ring-2 focus:ring-blue-400"
              placeholder="Enter email"
            />
          </div>
          <button
            type="button"
            onClick={handleFetch}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition"
          >
            Fetch Details
          </button>
        </div>

        {/* Name, Age, Gender, Contact */}
        <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
        <Input label="Age" name="age" type="number" value={formData.age} onChange={handleChange} />
        <Select
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={['Male', 'Female', 'Other']}
        />
        <Input label="Contact Number" name="contact" value={formData.contact} onChange={handleChange} />

        {/* Current Address as textarea spanning both columns */}
        <TextArea label="Current Address" name="address" value={formData.address} onChange={handleChange} />

        {/* City */}
        <Input label="Current City" name="city" value={formData.city} onChange={handleChange} />

        {/* Qualification with Rating */}
        <div>
          <label className="text-gray-600 font-semibold">Qualification</label>
          <select
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select</option>
            <option value="High School">High School</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelors">Bachelors</option>
            <option value="Masters">Masters</option>
            <option value="PhD">PhD</option>
            <option value="MBBS">MBBS</option>
            <option value="Other">Other</option>
          </select>

          <div className="mt-2 flex items-center gap-1">
            {Array(formData.qualificationRating)
              .fill()
              .map((_, i) => (
                <FaStar key={i} className="text-yellow-400" />
              ))}
            {formData.qualification && (
              <span className="text-sm text-gray-600 ml-2">
                {formData.qualificationRating} / 5
              </span>
            )}
          </div>
        </div>

        {/* Occupation */}
        <Select
          label="Occupation"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          options={['Student', 'Doctor', 'Engineer', 'Teacher', 'Business', 'Retired', 'Other']}
        />

        {/* Aadhaar and Profile Pic side by side */}
        <div className="col-span-2 flex gap-10 items-center">
          <FileInput
            label="Aadhaar Card"
            name="aadhaarPic"
            preview={preview.aadhaarPic}
            onChange={handleChange}
          />

          <FileInput
            label="Profile Picture"
            name="profilePic"
            preview={preview.profilePic}
            onChange={handleChange}
            circle
          />
        </div>

        {/* Separate Save and Update Buttons */}
        <div className="col-span-2 flex justify-center gap-6 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleSave}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg"
          >
            Save
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleUpdate}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg"
          >
            Update
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

// Rating Function
const getEducationRating = (qualification) => {
  switch (qualification) {
    case 'High School':
      return 1;
    case 'Diploma':
      return 2;
    case 'Bachelors':
      return  3;
    case 'Masters':
      return 4;
    case 'PhD':
    case 'MBBS':
      return 5;
    default:
      return 0;
  }
};

// Input Component
const Input = ({ label, name, value, onChange, type = 'text' }) => (
  <div>
    <label className="text-gray-600 font-semibold">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
      placeholder={`Enter ${label.toLowerCase()}`}
    />
  </div>
);

// TextArea Component for larger address input
const TextArea = ({ label, name, value, onChange }) => (
  <div className="col-span-2">
    <label className="text-gray-600 font-semibold">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={4}
      className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 resize-y"
      placeholder={`Enter ${label.toLowerCase()}`}
    />
  </div>
);

// Select Component
const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="text-gray-600 font-semibold">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

// File Upload with Preview
const FileInput = ({ label, name, preview, onChange, circle }) => (
  <div>
    <label className="text-gray-600 font-semibold">{label}</label>
    <div className="mt-1 flex items-center gap-4">
      <label className="cursor-pointer flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border border-gray-300 transition">
        <FaUpload className="text-gray-600" />
        <span className="text-sm text-gray-700">Upload</span>
        <input
          type="file"
          name={name}
          accept="image/*"
          onChange={onChange}
          className="hidden"
        />
      </label>
      {preview && (
        <img
          src={preview}
          alt={`${name} preview`}
          className={`w-20 h-20 object-cover border rounded-lg shadow-sm ${
            circle ? 'rounded-full' : ''
          }`}
        />
      )}
    </div>
  </div>
);

export default UserDetailsForm;
