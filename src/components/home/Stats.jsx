import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { id: 1, name: 'Happy Customers', value: '50K+' },
  { id: 2, name: 'Quality Products', value: '1,200+' },
  { id: 3, name: 'Expert Pharmacists', value: '85+' },
  { id: 4, name: 'Cities Covered', value: '120+' },
];

const Stats = () => {
  return (
    <section className="bg-slate-100  py-10 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-60 h-60 rounded-full bg-white blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 rounded-full bg-white blur-3xl animate-pulse delay-700" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl lg:max-w-none"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Trusted by healthcare professionals worldwide
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              We continue to set standards in modern pharmacy services.
            </p>
          </div>
          <dl className="mt-10 grid grid-cols-1 gap-0.5 overflow-hidden text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                className="flex flex-col bg-blue-500 py-10  backdrop-blur-sm rounded-4xl"
              >
                <dt className="text-sm font-semibold leading-6 text-blue-100">{stat.name}</dt>
                <dd className="order-first text-4xl font-black tracking-tight text-white mb-2">{stat.value}</dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
