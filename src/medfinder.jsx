import { useState, useEffect } from "react";
import { MapPin, Pill, Search, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { server_url } from "./config/url";

export default function MedFinder() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedMed, setSelectedMed] = useState("");
  const [modalMed, setModalMed] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [cities, setCities] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [allMeds, setAllMeds] = useState([]);

  // Fetch cities
  useEffect(() => {
    async function fetchCities() {
      try {
        const url = server_url + "/reciever/fetchcities";
        const resp = await axios.get(url);
        console.log("Fetched Cities:", resp.data);
        setCities(Array.isArray(resp.data) ? resp.data : []);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setCities([]);
      }
    }
    fetchCities();
  }, []);

  // Fetch all medicine names
  useEffect(() => {
    async function fetchMedicines() {
      try {
        const url = server_url + "/reciever/fetchmedicines";
        const resp = await axios.get(url);
        console.log("Fetched Medicines:", resp.data);
        setAllMeds(Array.isArray(resp.data) ? resp.data : []);
      } catch (err) {
        console.error("Error fetching medicines:", err);
        setAllMeds([]);
      }
    }
    fetchMedicines();
  }, []);
  const token=localStorage.getItem("token");
  // Search for medicines
  const handleSearch = async () => {
    if (!selectedCity || !selectedMed) {
      alert("Please select a city and a medicine!");
      return;
    }

    setIsSearching(true);
    try {
      const url = server_url+"/reciever/findmed";
      const resp = await axios.post(
        url,
        { selectedCity, selectedMed },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" ,'authorization':`Bearer ${token}`} }
      );

      console.log("Search Result:", resp.data);
      setMedicines(Array.isArray(resp.data) ? resp.data : []);
    } catch (err) {
      console.error("Error searching meds:", err);
      setMedicines([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Fetch donor details for the selected medicine
  const handleViewDetails = async (med) => {
    console.log(med.email);
    try {
      const url = server_url + "/reciever/meddetails";
      const resp = await axios.post(
        url,
        { email: med.email },
        { headers: { "Content-Type": "application/x-www-form-urlencoded"} }
      );
      console.log("Donor Details:", resp.data);

      // Merge medicine info with donor info
      setModalMed({ ...med, donor: resp.data });
    } catch (err) {
      console.error("Error fetching med details:", err);
      alert("Unable to fetch details for this medicine");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-6">
      {/* Header */}
      <motion.h1
        className="text-4xl font-extrabold text-center text-blue-800 drop-shadow-lg mb-10"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Med Finder
      </motion.h1>

      {/* Search Filters */}
      <motion.div
        className="flex flex-col md:flex-row gap-6 justify-center mb-12 items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {/* City Combo Box */}
        <div className="relative w-64">
          <MapPin className="absolute top-3 left-3 text-blue-500" />
          <input
            list="cities"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            placeholder="Select City"
            className="w-full border border-blue-400 bg-white/70 backdrop-blur-md rounded-lg pl-10 px-4 py-2 text-blue-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
          <datalist id="cities">
            {cities.length > 0 ? (
              cities.map((city, idx) => <option key={idx} value={city} />)
            ) : (
              <option value="Loading..." />
            )}
          </datalist>
        </div>

        {/* Medicine Combo Box */}
        <div className="relative w-64">
          <Pill className="absolute top-3 left-3 text-blue-500" />
          <input
            list="meds"
            value={selectedMed}
            onChange={(e) => setSelectedMed(e.target.value)}
            placeholder="Select Medicine"
            className="w-full border border-blue-400 bg-white/70 backdrop-blur-md rounded-lg pl-10 px-4 py-2 text-blue-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
          <datalist id="meds">
            {allMeds.length > 0 ? (
              allMeds.map((med, idx) => <option key={idx} value={med} />)
            ) : (
              <option value="Loading..." />
            )}
          </datalist>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-md"
        >
          <Search className="w-4 h-4" />
          Search Medicine
        </button>
      </motion.div>

      {/* Search Results */}
      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div
            key="loading"
            className="flex justify-center items-center h-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader className="w-8 h-8 text-blue-600 animate-spin mr-2" />
            <p className="text-blue-700 text-lg font-semibold">
              Searching medicines...
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 md:px-12"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            {medicines.length > 0 ? (
              medicines.map((med, idx) => (
                <motion.div
                  key={idx}
                  className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition transform duration-300 text-center"
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.9 },
                    show: { opacity: 1, y: 0, scale: 1 },
                  }}
                >
                  <h2 className="text-xl font-bold text-blue-800 mb-2">
                    {med.medicineName}
                  </h2>
                  <p className="text-gray-700 mb-2">Packing: {med.packingType}</p>
                  <p className="text-gray-500 text-sm">Donor Email: {med.email}</p>
                  <button
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition mt-3"
                    onClick={() => handleViewDetails(med)}
                  >
                    View Details
                  </button>
                </motion.div>
              ))
            ) : (
              <motion.p
                className="text-center col-span-full text-red-600 font-semibold text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No medicines found in {selectedCity || "this city"}.
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
<AnimatePresence>
  {modalMed && (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-3xl shadow-2xl max-w-lg w-full relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close Button */}
        <button
          onClick={() => setModalMed(null)}
          className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition"
        >
          ✕
        </button>

        {/* Medicine Info */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-2">
            {modalMed.medicineName}
          </h2>
          <p className="text-gray-600 text-sm mb-4 italic">{modalMed.company}</p>
          <p className="text-gray-700">
            <strong>Packing:</strong> {modalMed.packingType}
          </p>
          <p className="text-gray-700">
            <strong>Quantity:</strong> {modalMed.quantity}
          </p>
          <p className="text-gray-700">
            <strong>Expiry:</strong>{" "}
            {new Date(modalMed.expiryDate).toLocaleDateString()}
          </p>
        </div>

        {/* Donor Info Card */}
        {modalMed.donor && (
          <div className="mt-6 bg-white rounded-xl shadow-inner p-5">
            <div className="flex items-center gap-4">
              <img
                src={modalMed.donor.profilePic}
                alt="Donor"
                className="w-16 h-16 rounded-full border-2 border-blue-400"
              />
              <div>
                <h3 className="text-lg font-semibold text-blue-700">
                  {modalMed.donor.name}
                </h3>
                <p className="text-gray-500 text-sm">{modalMed.donor.occupation}</p>
              </div>
            </div>
            <div className="mt-4 text-gray-700 text-sm space-y-1">
              <p><strong>Email:</strong> {modalMed.donor.email}</p>
              <p><strong>Contact:</strong> {modalMed.donor.contact}</p>
              <p>
                <strong>Address:</strong> {modalMed.donor.address},{" "}
                {modalMed.donor.city}
              </p>
              <p><strong>Qualification:</strong> {modalMed.donor.qualification}</p>
              <p><strong>Occupation:</strong> {modalMed.donor.occupation}</p>
              
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setModalMed(null)}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  );
}
