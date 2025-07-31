import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";

// Public folder image references
const service1 = "/images/Gemini_Generated_Image_cv48t7cv48t7cv48.png";
const service2 = "/images/Gemini_Generated_Image_luq0zbluq0zbluq0.png";
const service3 = "/images/Gemini_Generated_Image_i37mkbi37mkbi37m.png";
const crousel1 = "/images/Gemini_Generated_Image_qbaokaqbaokaqbao.png";
const crousel2="/images/Gemini_Generated_Image_qhfozjqhfozjqhfo.png";
const crousel3="/images/Gemini_Generated_Image_ho3851ho3851ho38.png";
export default function IndexPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel */}
      <section className="pt-20">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000 }}
          loop={true}
          className="w-full h-[400px]"
        >
          {[
            {
              img: crousel1,
              title: "Find Trusted Medicine Services",
              
            },
            {
              img: crousel2,
              title: "Donate Medicines & Equipment",
              
            },
            {
              img: crousel3,
              title: "Find Reliable Medical Equipment",
              
            },
          ].map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-[400px]">
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
                    {slide.title}
                  </h2>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-100">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-blue-600">About Us</h2>
          <p className="mt-6 text-lg text-gray-700 leading-relaxed">
            At <span className="font-semibold text-blue-600">Medicose</span>, we are committed to making healthcare services accessible and reliable for everyone.
            Our platform connects patients with trusted doctors, clinics, and hospitals while also helping individuals donate unused medicines
            and medical equipment to those in need. We believe in a world where quality healthcare resources are available to all,
            and we strive to make this vision a reality.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-blue-600">Our Services</h2>
        <div className="mt-10 grid gap-8 px-6 md:px-20 md:grid-cols-3">
          {[
            {
              title: "Medicine Finder",
              desc: "Find doctors, clinics, and hospitals quickly.",
              img: service1,
            },
            {
              title: "Equipment Finder",
              desc: "Search for nearby medical equipment to rent or purchase.",
              img: service2,
            },
            {
              title: "Donate Medicines & Equipment",
              desc: "Give unused medications or equipment to those in need.",
              img: service3,
            },
          ].map((service, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              className="bg-gray-50 shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={service.img}
                alt={service.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
                <p className="text-gray-600 mt-2">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-100">
        <h2 className="text-3xl font-bold text-center text-blue-600">Contact Us</h2>
        <div className="mt-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6 md:px-20">
          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">Get in Touch</h3>
            <p className="text-gray-600 mt-4">
              Have any questions? Reach out to our support team. We’re here to help you 24/7.
            </p>
            <ul className="mt-6 text-gray-700 space-y-2">
              <li>
                <strong>Email:</strong> support@medicare.com
              </li>
              <li>
                <strong>Phone:</strong> +91-9878337737
              </li>
              <li>
                <strong>Address:</strong> Barrister Mullah Colony, MNNIT Allahabad Campus, Teliarganj, Prayagraj, Uttar Pradesh 211004
              </li>
            </ul>
          </div>

          {/* Embedded Google Map */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <iframe
              title="Google Map"
              className="w-full h-64 md:h-80 border-0"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3601.3467096022705!2d81.85980587414966!3d25.49348107752143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399aca78818ddc51%3A0x6690dd2de3a1415b!2sMotilal%20Nehru%20National%20Institute%20of%20Technology%2C%20Allahabad!5e0!3m2!1sen!2sin!4v1753531515818!5m2!1sen!2sin"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-800 text-white text-center">
        <p>© 2025 MediCare. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
