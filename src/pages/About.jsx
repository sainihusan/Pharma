import {
  ShieldCheck,
  HeartPulse,
  Truck,
  Users,
  Activity,
  Globe,
  Award,
  Target,
  Zap,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function About() {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const values = [
    {
      icon: <Award className="text-amber-500" size={32} />,
      title: "Excellence",
      desc: "We strive for perfection in every product we deliver and every service we provide."
    },
    {
      icon: <Target className="text-red-500" size={32} />,
      title: "Precision",
      desc: "Methodical accuracy in our pharmaceutical sourcing and distribution and order fulfillment."
    },
    {
      icon: <Zap className="text-yellow-500" size={32} />,
      title: "Innovation",
      desc: "Embracing cutting-edge technology to make healthcare smarter and more accessible."
    },
    {
      icon: <Clock className="text-emerald-500" size={32} />,
      title: "Reliability",
      desc: "Your health can't wait, and neither do we. Consistent 24/7 service you can trust."
    }
  ];

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen pb-14 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 pt-10">

        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden mb-14 shadow-2xl group"
        >
          <img
            src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Modern Pharmacy"
            className="w-full h-[400px] sm:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 sm:from-blue-900/90 via-blue-900/80 sm:via-blue-800/40 to-blue-900/40 sm:to-transparent flex flex-col justify-center px-6 sm:px-12 md:px-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 mb-4 text-[10px] sm:text-xs font-bold tracking-widest text-blue-300 uppercase bg-blue-900/40 backdrop-blur-md rounded-full border border-blue-400/30">
                Our Story
              </span>
              <h1 className="text-2xl md:text-5xl lg:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight max-w-full sm:max-w-xl">
                Redefining the <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                  Pharmacy Experience
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-blue-100/90 max-w-sm sm:max-w-lg mb-6 sm:mb-8 leading-relaxed">
                PharmaCare isn't just about medicine. It's about a healthier future, built on trust,
                technology, and an unwavering commitment to your well-being.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/shop")}
                  className="px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* WHO WE ARE */}
        <div className="grid lg:grid-cols-2 gap-10 items-center mb-15">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-extrabold text-slate-900 mb-8 flex items-center">
              <span className="w-12 h-1 bg-blue-600 mr-4 rounded-full"></span>
              The PharmaCare Legacy
            </h2>
            <div className="space-y-6 text-lg text-slate-600">
              <p>
                Founded on the principle of transparency, <span className="text-blue-600 font-semibold">PharmaCare</span> has
                emerged as a pioneer in digital healthcare. We believe that access to genuine medicine
                should be a right, not a privilege.
              </p>
              <p>
                By bridging the gap between world-class pharmaceutical manufacturers and the end user,
                we ensure that every tablet, every bottle, and every health product meets the highest
                global standards of efficacy and safety.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="font-medium text-slate-800 text-sm">Verified Suppliers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <HeartPulse size={20} />
                  </div>
                  <span className="font-medium text-slate-800 text-sm">Patient Centric</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-3xl blur-2xl opacity-20"></div>
            <img
              src="https://plus.unsplash.com/premium_photo-1661769786626-8025c37907ae?w=600&auto=format&fit=crop"
              alt="Pharmacy Logistics"
              className="relative w-full h-[300px] sm:h-[400px] lg:h-[450px] object-cover rounded-3xl shadow-2xl border-white"
            />
            <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[160px] sm:max-w-[200px]">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">100%</div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Quality Assurance on every single product.</p>
            </div>
          </motion.div>
        </div>

        {/* STATS SECTION */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-8 mb-14"
        >
          {[
            { value: "50K+", label: "Product Units Delivered", icon: <Truck size={24} /> },
            { value: "15+", label: "Years of Trust", icon: <Award size={24} /> },
            { value: "99.9%", label: "Accuracy Rate", icon: <Activity size={24} /> },
            { value: "24/7", label: "Expert Assistance", icon: <Users size={24} /> },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeIn}
              className="bg-cyan-100 backdrop-blur-xl p-8 rounded-3xl border border-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
            >
              <div className="mb-4 text-blue-600 bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-1">{item.value}</h3>
              <p className="text-slate-500 font-medium">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* OUR VALUES */}
        <div className="mb-15">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Core Principles</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              The values that drive us to provide the best healthcare solutions every single day.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 text-center"
              >
                <div className="mx-auto w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-50">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{val.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* MISSION & VISION */}
        <div className="grid md:grid-cols-2 gap-8 mb-15">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden group p-10 rounded-[40px] bg-blue-600 text-white shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20 -rotate-12 group-hover:rotate-0 transition-transform duration-500">
              <Target size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <Activity size={32} />
              </div>
              <h3 className="text-3xl font-black mb-4">Our Mission</h3>
              <p className="text-blue-50 text-lg leading-relaxed">
                To make healthcare accessible, affordable, and efficient for everyone
                by leveraging technology and trusted pharmaceutical partnerships. We aim
                to eliminate health inequality through innovation.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden group p-10 rounded-[40px] bg-indigo-600 text-white shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20 -rotate-12 group-hover:rotate-0 transition-transform duration-500">
              <Globe size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <Globe size={32} />
              </div>
              <h3 className="text-3xl font-black mb-4">Our Vision</h3>
              <p className="text-indigo-50 text-lg leading-relaxed">
                To become a leading global healthcare platform where people can access
                reliable medical products and services with ease. We envision a world
                where technology perfectly serves human health.
              </p>
            </div>
          </motion.div>
        </div>

        {/* LEADERSHIP TEAM */}
        <div className="mb-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Meet Our Experts</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Our team of dedicated pharmacists and healthcare professionals are here
              to guide you towards better health.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Dr. Deepak Namjoshi", role: "Chief Pharmacist", img: "https://www.criticareasiahospital.com/assets/frontend/img/DeepakSir3.png" },
              { name: "Michael Chen", role: "Director of Logistics", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200" },
              { name: "Dr. Rupali Shah", role: "Wellness Consultant", img: "data:image/jpeg;base64,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" },
              { name: "David Wilson", role: "Operations Head", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200" },
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="relative mb-6 overflow-hidden rounded-[32px] aspect-square">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{member.name}</h3>
                  <p className="text-slate-500 font-medium">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>


        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[50px] overflow-hidden p-1 p-px bg-gradient-to-r from-blue-600 to-indigo-600 shadow-2xl"
        >
          <div className="relative bg-slate-900 rounded-[49px] py-12 px-8 md:px-20 text-center overflow-hidden">

            <div className="absolute top-[-30%] left-[-10%] w-[300px] h-[300px] bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
            <div className="absolute bottom-[-30%] right-[-10%] w-[300px] h-[300px] bg-indigo-600 rounded-full blur-[100px] opacity-20"></div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">
                Your Health, <span className="text-blue-500 font-black italic">Our Priority.</span>
              </h2>
              <p className="mb-10 text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto">
                Ready to experience the future of healthcare? Browse our pharmacy catalog
                and get expert consultation anytime.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/shop")}
                  className="px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all shadow-[0_10px_20px_-5px_rgba(59,130,246,0.5)] active:scale-95 text-sm sm:text-base"
                >
                  Explore Our Shop
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="px-6 sm:px-10 py-4 sm:py-5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-2xl font-bold transition-all active:scale-95 text-sm sm:text-base"
                >
                  Talk to a Pharmacist
                </button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}