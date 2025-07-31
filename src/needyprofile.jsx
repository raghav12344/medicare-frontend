import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { server_url } from "./config/url";

const FileInputWithPreview = ({ fileKey, formData, setFormData, label }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const inputRef = useRef();

  const fileOrUrl = formData[fileKey];

  useEffect(() => {
    if (!fileOrUrl) {
      setPreviewUrl(null);
      return;
    }

    if (fileOrUrl instanceof File) {
      if (fileOrUrl.type?.startsWith("image/")) {
        const objectUrl = URL.createObjectURL(fileOrUrl);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
      setPreviewUrl(null);
    } else if (typeof fileOrUrl === "string") {
      setPreviewUrl(fileOrUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [fileOrUrl]);

  const displayFileName = (file) =>
    file
      ? file instanceof File
        ? file.name.length > 25
          ? file.name.slice(0, 22) + "..."
          : file.name
        : "Uploaded image"
      : "No file chosen";

  const handleClick = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [fileKey]: e.target.files[0] });
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <motion.div
        onClick={handleClick}
        whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(67, 56, 202, 0.3)" }}
        whileTap={{ scale: 0.97 }}
        className="cursor-pointer relative w-full h-36 sm:h-44 rounded-xl border-2 border-dashed border-indigo-400 flex flex-col items-center justify-center bg-indigo-50 text-indigo-700 text-center select-none shadow-sm transition-colors duration-300"
      >
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleChange}
          ref={inputRef}
          className="hidden"
          required
        />
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-24 sm:max-h-32 max-w-full object-contain rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 px-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v6m0 0l-3-3m3 3l3-3M4 12v-1a4 4 0 014-4h8a4 4 0 014 4v1"
              />
            </svg>
            <p className="text-sm font-medium select-none">Tap to upload</p>
          </div>
        )}
        {fileOrUrl && (
          <p className="absolute bottom-2 left-0 right-0 text-xs sm:text-sm text-indigo-700 font-mono truncate px-3">
            {displayFileName(fileOrUrl)}
          </p>
        )}
      </motion.div>
    </div>
  );
};

const NeedyProfile = () => {
  const [formData, setFormData] = useState({
    email: "",
    contact: "",
    address: "",
    aadhaarNumber: "",
    name: "",
    dob: "",
    gender: "",
    aadharFront: null,
    aadharBack: null,
  });
  useEffect(()=>{
    const email=localStorage.getItem("activeUser");
    setFormData({...formData,email});
  },[]);
  const token=localStorage.getItem("token");
  const [submitted, setSubmitted] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [extracting, setExtracting] = useState(false);

  // Check if extracted fields are populated to enable submit
  const isExtracted =
    formData.name.trim() !== "" &&
    formData.aadhaarNumber.trim() !== "" &&
    formData.address.trim() !== "" &&
    formData.dob.trim() !== "" &&
    formData.gender.trim() !== "";

  const handleFetch = async () => {
    if (!formData.email) {
      alert("Please enter an email first.");
      return;
    }

    function formatToLocalYMD(dateInput) {
      const d = new Date(dateInput);
      return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
      ].join("-");
    }

    setFetching(true);
    try {
      const url = server_url + "/reciever/fetchdetails";
      const resp = await axios.post(url, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded",'authorization':`Bearer ${token}` },
      });

      if (resp.data.status === true) {
        const fetchedData = resp.data.obj;
        console.log(fetchedData)
        fetchedData.dob = formatToLocalYMD(fetchedData.dob);

        const aadharFrontUrl = fetchedData.aadharFront || null;
        const aadharBackUrl = fetchedData.aadharBack || null;

        setFormData((prev) => ({
          ...prev,
          ...fetchedData,
          aadharFront: aadharFrontUrl,
          aadharBack: aadharBackUrl,
        }));

        alert(`Fetched data for ${formData.email}`);
      } else {
        alert("Failed to fetch data.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data.");
    }
    setFetching(false);
  };

  const formatDateToYMD = (dateStr) => {
    if (!dateStr) return "";

    // Try parsing dd/mm/yyyy or dd-mm-yyyy formats
    const parts = dateStr.split(/[-\/]/);
    if (parts.length !== 3) return "";

    const [day, month, year] = parts;

    if (!day || !month || !year) return "";

    return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const handleExtract = async () => {
    const { aadharFront, aadharBack } = formData;
    if (!aadharFront || !aadharBack) {
      alert("Please upload both sides of the Aadhaar card.");
      return;
    }

    setExtracting(true);
    try {
      const postData = new FormData();

      const convertUrlToFile = async (url, filename) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
      };

      const frontFile = aadharFront instanceof File ? aadharFront : await convertUrlToFile(aadharFront, "aadharFront.jpg");
      const backFile = aadharBack instanceof File ? aadharBack : await convertUrlToFile(aadharBack, "aadharBack.jpg");

      postData.append("aadharFront", frontFile);
      postData.append("aadharBack", backFile);

      const response = await axios.post(server_url + "/reciever/getaadharinfo", postData, {
        headers: { "Content-Type": "multipart/form-data",'authorization':`Bearer ${token}` },
      });
      const data = response.data.obj;

      setFormData((prev) => ({
        ...prev,
        name: data.name || "",
        address: data.address || "",
        aadhaarNumber: data.adhaar_number || "",
        dob: formatDateToYMD(data.dob) || "",
        gender: data.gender || "",
      }));

      alert("Aadhaar data extracted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to extract Aadhaar data.");
    }
    setExtracting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      email,
      contact,
      address,
      aadhaarNumber,
      name,
      dob,
      gender,
      aadharFront,
      aadharBack,
    } = formData;

    if (
      !email ||
      !contact ||
      !address ||
      !aadhaarNumber ||
      !name ||
      !dob ||
      !gender ||
      !aadharFront ||
      !aadharBack
    ) {
      alert("Please complete all fields and uploads.");
      return;
    }
    let postData = new FormData();
    for (let prop in formData) {
      postData.append(prop, formData[prop]);
    }
    try {
      const response = await axios.post(server_url + "/reciever/needydetails", postData, {
        headers: { "Content-Type": "multipart/form-data",'authorization':`Bearer ${token}` },
      });
      if (response.data.status === true) alert(response.data.msg);
      else alert("Failed to submit");
    } catch (error) {
      console.error(error);
      alert("Error submitting data");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-3xl p-6 sm:p-8 bg-white rounded-3xl shadow-xl"
      >
        <h2 className="text-3xl font-extrabold text-center mb-8 text-indigo-700">Needy Profile Form</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email + Fetch */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={formData.email}
                readOnly
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="flex-grow rounded-xl border px-4 py-3 text-base text-gray-500 bg-gray-100"
                placeholder="you@example.com"
                required
              />
              <motion.button
                type="button"
                onClick={handleFetch}
                disabled={fetching}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-xl px-5 py-3 text-white font-semibold ${
                  fetching ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {fetching ? "Fetching..." : "Fetch"}
              </motion.button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
            <input
              type="tel"
              pattern="[0-9]{10}"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="w-full rounded-xl border px-4 py-3 text-base text-gray-700"
              placeholder="9876543210"
              required
            />
          </div>

          {/* Aadhaar Card Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FileInputWithPreview
              fileKey="aadharFront"
              formData={formData}
              setFormData={setFormData}
              label="Aadhaar Card Front"
            />
            <FileInputWithPreview
              fileKey="aadharBack"
              formData={formData}
              setFormData={setFormData}
              label="Aadhaar Card Back"
            />
          </div>

          {/* Extract Button */}
          <motion.button
            type="button"
            onClick={handleExtract}
            disabled={extracting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full rounded-xl px-6 py-3 text-white font-semibold ${
              extracting ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {extracting ? "Extracting..." : "Extract Aadhaar Data"}
          </motion.button>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              readOnly
              placeholder="Auto-filled after extraction"
              className="w-full rounded-xl border px-4 py-3 text-base text-gray-500 bg-gray-100 cursor-not-allowed"
              // no onChange to prevent edits
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
            <textarea
              value={formData.address}
              readOnly
              placeholder="Auto-filled after extraction"
              className="w-full rounded-xl border px-4 py-3 text-base text-gray-500 bg-gray-100 resize-none cursor-not-allowed"
              rows={3}
            />
          </div>

          {/* Aadhaar Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhaar Number</label>
            <input
              type="text"
              maxLength={12}
              value={formData.aadhaarNumber}
              readOnly
              placeholder="Auto-filled after extraction"
              className="w-full rounded-xl border px-4 py-3 text-base text-gray-500 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              value={formData.dob}
              readOnly
              placeholder="Auto-filled after extraction"
              className="w-full rounded-xl border px-4 py-3 text-base text-gray-500 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
            <input
              type="text"
              value={formData.gender}
              readOnly
              placeholder="Auto-filled after extraction"
              className="w-full rounded-xl border px-4 py-3 text-base text-gray-500 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={isExtracted ? { scale: 1.05 } : {}}
            whileTap={isExtracted ? { scale: 0.95 } : {}}
            disabled={!isExtracted}
            className={`w-full rounded-xl px-6 py-3 font-semibold text-white ${
              isExtracted
                ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                : "bg-indigo-300 cursor-not-allowed"
            }`}
          >
            Submit
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default NeedyProfile;
