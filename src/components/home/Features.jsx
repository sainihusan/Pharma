import { ShieldCheck, Truck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4  py-8 overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
        }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="text-base font-semibold leading-7 text-blue-600">Premium Service</h2>
        <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
          Everything you need for better health
        </p>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-8 text-gray-600">
          We've reimagined the pharmacy experience from the ground up to be seamless, reliable, and completely focused on you.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto mt-10 "
      >
        <dl className="grid grid-cols-1 md:grid-cols-3  gap-x-8 gap-y-1">
          {[
            {
              icon: <ShieldCheck className="h-7 w-7 text-blue-600" />,
              bg: 'bg-blue-100',
              title: 'Verified Quality',
              desc: 'All our medicines are sourced directly from verified manufacturers and stored in optimal conditions.',
            },
            {
              icon: <Truck className="h-7 w-7 text-indigo-600" />,
              bg: 'bg-indigo-100',
              title: 'Fast Delivery',
              desc: 'Get your essential medications delivered securely to your doorstep within hours, fully trackable.',
            },
            {
              icon: <Clock className="h-7 w-7 text-rose-600" />,
              bg: 'bg-rose-100',
              title: '24/7 Support',
              desc: 'Our certified pharmacists are available around the clock to answer your medical queries.',
            },
          ].map((feature) => (
            <motion.div key={feature.title} variants={itemVariants} className="flex flex-col items-center text-center">
              <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full ${feature.bg} shadow-md`}>
                {feature.icon}
              </div>
              <dt className="text-lg sm:text-xl font-semibold text-gray-900">{feature.title}</dt>
              <dd className="mt-2 text-sm sm:text-base text-gray-600">{feature.desc}</dd>
            </motion.div>
          ))}
        </dl>
      </motion.div>
    </div>
  );
}
