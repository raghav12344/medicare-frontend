import { motion } from "framer-motion";
import { User, Pill, Package, ClipboardList, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NeedyDashboard() {
    const navg=useNavigate();
    function donavg(url)
    {
        navg("/"+url);
    }
  const cards = [
    {
      title: "Profile",
      icon: <User size={40} className="text-[#38bdf8]" />,
      desc: "View and update your personal information.",
      link: "needy/profile",
      bg: "bg-[#0f172a]",
    },
    {
      title: "Request Medicine",
      icon: <Pill size={40} className="text-[#fbbf24]" />,
      desc: "Request medicines from donors.",
      link: "needy/reqmedicine",
      bg: "bg-[#1e293b]",
    },
    {
      title: "Request Equipment",
      icon: <Package size={40} className="text-[#ef4444]" />,
      desc: "Request medical equipment support.",
      link: "needy/reqequip",
      bg: "bg-[#0f172a]",
    }
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] py-12 px-6 md:px-20">
      {/* Dashboard Header */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold pt-4 text-[#0f172a] mb-10 text-center"
      >
        Needy Dashboard
      </motion.h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`${card.bg} text-white p-6 rounded-2xl shadow-lg cursor-pointer hover:shadow-2xl transition`}
          >
            <div className="flex items-center justify-center mb-4">{card.icon}</div>
            <h2 className="text-xl font-semibold text-center">{card.title}</h2>
            <p className="text-sm text-gray-300 mt-2 text-center">{card.desc}</p>
            <div className="flex justify-center mt-4">
              <a
                onClick={()=>{donavg(card.link)}}
                className="bg-[#38bdf8] text-[#0f172a] px-4 py-2 rounded-lg font-semibold hover:bg-[#fbbf24] transition"
              >
                Go
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
