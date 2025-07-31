import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { server_url } from './config/url';

function MedicineDonationForm() {
  const location = useLocation();
  const data = location.state;

  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const token = localStorage.getItem("token");
useEffect(() => {
  const fetchMedicine = async () => {
    if (data != null) {
      setIsUpdateMode(true);
      try {
        let resp = await axios.post(
          server_url + "/donar/fetchmed",
          data,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'authorization': `Bearer ${token}`
            }
          }
        );

        let obj = resp.data.obj;
        // Convert expiryDate to YYYY-MM-DD format
        if (obj.expiryDate) {
          obj.expiryDate = new Date(obj.expiryDate)
            .toISOString()
            .split('T')[0]; // YYYY-MM-DD
        }

        setFormData({...obj,id:data.id});
      } catch (err) {
        console.error("Error fetching medicine:", err);
      }
    }
  };

  fetchMedicine();
}, [data, token]);


  const [formData, setFormData] = useState({
    id:'',
    email: '',
    medicineName: '',
    company: '',
    expiryDate: '',
    packingType: '',
    quantity: '',
    otherInfo: '',
  });
  const email = localStorage.getItem("activeUser");
  useEffect(() => {
    
    setFormData((prev) => ({ ...prev, email }));
  }, []);

  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);


  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      id:'',
      email: email,
      medicineName: '',
      company: '',
      expiryDate: '',
      packingType: '',
      quantity: '',
      otherInfo: '',
    });
  };

  const handleSaveToPublic = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post(
        server_url + '/donar/post-medicine',
        formData,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'authorization': `Bearer ${token}` } }
      );
      if (response.data.status === true) {
        setMessage('✅ Donation saved to public successfully!');
        resetForm();
      } else {
        setMessage('❌ Failed to save.');
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Error occurred while saving.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post(
        server_url + '/donar/update-medicine',
        formData,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'authorization': `Bearer ${token}` } }
      );
      if (response.data.status === true) {
        setMessage('🔄 Donation updated successfully!');
        resetForm();
      } else {
        setMessage('❌ Update failed.');
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Error occurred while updating.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4 pt-10">
      <div
        className={`w-full max-w-xl p-8 rounded-2xl shadow-2xl backdrop-blur-md bg-white/30 border border-white/40 transition-all duration-700 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Medicine Donation Form</h2>

        <form className="space-y-5">
          <InputField label="Email" name="email" type="email" readOnly={true} value={formData.email} onChange={handleChange} />
          <InputField label="Medicine Name" name="medicineName" value={formData.medicineName} onChange={handleChange} />
          <InputField label="Company" name="company" value={formData.company} onChange={handleChange} />
          <InputField label="Expiry Date" name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} />

          <div>
            <label className="block text-gray-700 font-medium mb-1">Packing Type</label>
            <select
              name="packingType"
              value={formData.packingType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="">Select type</option>
              <option value="Tablet">Tablet</option>
              <option value="Capsule">Capsule</option>
              <option value="Syrup">Syrup</option>
              <option value="Injection">Injection</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <InputField
            label="Quantity"
            name="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
          />

          <div>
            <label className="block text-gray-700 font-medium mb-1">Other Info</label>
            <textarea
              name="otherInfo"
              value={formData.otherInfo}
              onChange={handleChange}
              rows="3"
              placeholder="e.g., storage conditions, special notes"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div className="flex justify-center mt-6 space-x-4">
            <button
              type="button"
              id="savebtn"
              onClick={handleSaveToPublic}
              className={`text-white font-semibold py-2 px-6 rounded-lg shadow hover:scale-105 transition ${
                isUpdateMode ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-blue-500'
              }`}
              disabled={isUpdateMode}
            >
              Save to Public
            </button>
            <button
              type="button"
              id="updatebtn"
              onClick={handleUpdate}
              className={`text-white font-semibold py-2 px-6 rounded-lg shadow hover:scale-105 transition ${
                isUpdateMode ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!isUpdateMode}
            >
              Update
            </button>
          </div>
        </form>

        {message && (
          <p className="mt-5 text-center text-sm text-green-700 bg-green-100 rounded-md py-2 px-4">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

const InputField = ({ label, name, value, onChange, type = 'text', min, readOnly = false }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      min={min}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      required
      className={
        readOnly
          ? "text-gray-500 bg-gray-100 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          : "w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      }
    />
  </div>
);

export default MedicineDonationForm;
