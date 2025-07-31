import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader, Route } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { server_url } from './config/url';

function MedicineList() {
  const [medicines, setMedicines] = useState([]);
  const [emailFilter, setEmailFilter] = useState('');
  useEffect(()=>{
    const email=localStorage.getItem("activeUser");
    setEmailFilter(email);
  })
  const navg=useNavigate();
  const token=localStorage.getItem("token");
  const fetchMedicines = async () => {
    try {
      const response = await axios.post(server_url + "/donar/getmedicines", {
        email: emailFilter.trim() || undefined,
      },{headers:{"Content-Type":"application/x-www-form-urlencoded",'authorization':`Bearer ${token}`}});
      setMedicines(response.data.obj || []);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      await axios.post(server_url+"/donar/deletemedicine",{id},{headers:{"Content-Type":"application/x-www-form-urlencoded",'authorization':`Bearer ${token}`}});
      setMedicines((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete. Try again.');
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-blue-100 py-12 px-6">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Medicine Donations</h2>
          <div className="flex items-center gap-3">
            <input
              type="email"
              placeholder="Filter by email"
              value={emailFilter}
              readOnly
              onChange={(e) => setEmailFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-500 bg-gray-100"
            />
            <button
              onClick={fetchMedicines}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:scale-105 transition"
            >
              Search
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left border-collapse shadow-sm">
            <thead className="bg-indigo-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Medicine</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3">Packing</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Other Info</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.length > 0 ? (
                medicines.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-indigo-50 transition-all text-sm"
                  >
                    <td className="px-4 py-2">{item.email}</td>
                    <td className="px-4 py-2">{item.medicineName}</td>
                    <td className="px-4 py-2">{item.company}</td>
                    <td className="px-4 py-2">{item.expiryDate}</td>
                    <td className="px-4 py-2">{item.packingType}</td>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2">{item.otherInfo}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => {

                          navg("/donar/postmed",{state:{id:item._id}});
                        }}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    No donations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MedicineList;
