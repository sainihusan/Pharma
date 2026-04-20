import { MapPin, Phone, Mail, Send, Clock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent successfully!');
    e.target.reset();
  };

  return (
    <div className="relative bg-white min-h-screen overflow-hidden">

      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] opacity-50 z-0"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[80px] opacity-40 z-0"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-6 sm:py-9"
      >
        <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12 items-start">


          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold tracking-wider uppercase mb-4 shadow-sm border border-blue-100/50">
              <Globe size={14} />
              <span>Global Support</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-[1.2] mb-4 tracking-tight">
              A <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">healthier</span> world together.
            </h1>

            <p className="text-lg text-slate-500 max-w-lg mb-8 leading-relaxed">
              Our expert pharmacists provide 24/7 care for your health and prescriptions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <Phone className="text-blue-500" />, title: "Phone Support", detail: "+91 7973745678" },
                {
                  icon: (
                    <a href='https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox' target='_blank'>
                      <Mail className="text-indigo-500" />
                    </a>
                  ),
                  title: "Email Inquiry",
                  detail: "care@pharmacare.com"
                },
                { icon: <Clock className="text-amber-500" />, title: "Emergency", detail: "24/7 Priority" },
                {
                  icon: (<a href='https://maps.app.goo.gl/KaXyjHuSpwzsxmUr7' target='_blank'>
                    <MapPin className="text-rose-500" />
                  </a>),
                  title: "Headquarters",
                  detail: "Mohali, Punjab",
                  link: "https://maps.app.goo.gl/f1oF9C8sfkUYMHjZ8"
                }
              ].map((item, i) => (
                <div key={i} className="group p-4 rounded-3xl bg-white/40 backdrop-blur-md border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-50 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-slate-900 text-md mb-0.5">{item.title}</h4>
                  <p className="text-md font-medium text-slate-600">{item.detail}</p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      className="inline-block mt-2 text-[10px] font-bold text-blue-600 hover:underline"
                    >
                      View on Maps →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="xl:pl-6"
          >
            <div className="relative p-0.5 rounded-[2.5rem] bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-xl">
              <div className="bg-white rounded-[2.4rem] p-6 sm:p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-black text-slate-900 mb-1">Send us a message</h3>
                  <p className="text-slate-400 text-xs font-medium">We'll get back to you within 2 hours.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase">First Name</label>
                      <input type="text" required className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none text-sm font-medium placeholder:text-slate-300" placeholder="John" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase">Last Name</label>
                      <input type="text" required className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none text-sm font-medium placeholder:text-slate-300" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase">Work Email</label>
                    <input type="email" required className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none text-sm font-medium placeholder:text-slate-300" placeholder="john@example.com" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase">Subject</label>
                    <select className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none text-sm font-medium text-slate-900">
                      <option>General Inquiry</option>
                      <option>Prescription Question</option>
                      <option>Order Tracking</option>
                      <option>Report an Issue</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase">Your Message</label>
                    <textarea rows={3} required className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none text-sm font-medium resize-none placeholder:text-slate-300" placeholder="How can we help?"></textarea>
                  </div>

                  <button type="submit" className="group relative w-full overflow-hidden rounded-xl bg-slate-900 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/20 active:scale-[0.98]">
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      <span>Send Message</span>
                      <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                </form>

                <p className="mt-6 text-center text-[10px] text-slate-400 font-medium">
                  Secure messaging encrypted with SSL. View <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

