import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Brain,
  Truck,
  Factory,
  BarChart3,
  Leaf,
  Shield,
  Box,
  ArrowRight,
  Building2,
  Cpu,
  ClipboardCheck,
  Users,
  GlobeIcon,
  PieChart,
  LightbulbIcon,
} from "lucide-react";

const LandingPage = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Optimization",
      description: "Advanced algorithms for intelligent supplier selection",
    },
    {
      icon: <ClipboardCheck className="w-8 h-8" />,
      title: "Supplier Evaluation",
      description: "ESG-focused assessment of all supply chain partners",
    },
    {
      icon: <LightbulbIcon className="w-8 h-8" />,
      title: "Smart Recommendations",
      description: "Optimize for sustainability, ethics, and efficiency",
    },
    {
      icon: <GlobeIcon className="w-8 h-8" />,
      title: "Global Risk Mapping",
      description: "Visualize and mitigate geographical supply chain risks",
    },
    {
      icon: <PieChart className="w-8 h-8" />,
      title: "Supply Chain Analytics",
      description: "Comprehensive insights and network visualization",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Supplier Directory",
      description: "Centralized supplier profiles with ESG metrics",
    },
  ];

  const flowElements = [
    { icon: Building2, delay: 0 },
    { icon: Box, delay: 0.2 },
    { icon: Truck, delay: 0.4 },
    { icon: Factory, delay: 0.6 },
    { icon: Cpu, delay: 0.8 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6e3] to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-block bg-[#dcf3dc] border-2 border-[#81C784] rounded-full px-4 py-1 mb-6">
              <span className="text-[#2e7d32] font-medium">ESG Focused</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              EthicSupply
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Ethical AI-Powered Supply Chain Optimization
            </p>
            <motion.div>
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-900 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Get Started
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Animated Supply Chain Flow */}
          <div className="flex justify-center items-center gap-4 mb-20">
            {flowElements.map((Element, index) => (
              <React.Fragment key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Element.delay, duration: 0.5 }}
                  className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg"
                >
                  <Element.icon className="w-8 h-8 text-gray-700" />
                </motion.div>
                {index < flowElements.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: Element.delay + 0.1, duration: 0.3 }}
                  >
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
            <motion.div
              animate={{
                rotate: [0, 360],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -top-1/2 -left-1/2 w-full h-full border-[40px] border-[#dcf3dc] rounded-full"
            />
            <motion.div
              animate={{
                rotate: [360, 0],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -bottom-1/2 -right-1/2 w-full h-full border-[40px] border-[#81C784] rounded-full opacity-20"
            />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-[#2e7d32] mb-4"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold mb-2"
              >
                98%
              </motion.div>
              <div className="text-gray-300">Optimization Rate</div>
            </div>
            <div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl font-bold mb-2"
              >
                24/7
              </motion.div>
              <div className="text-gray-300">Real-time Monitoring</div>
            </div>
            <div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-4xl font-bold mb-2"
              >
                50%
              </motion.div>
              <div className="text-gray-300">Cost Reduction</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h2 className="text-4xl font-bold mb-8">
            Ready to optimize your supply chain?
          </h2>
          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-900 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Start Free Trial
            </motion.button>
          </Link>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-10 left-10 w-20 h-20 bg-[#dcf3dc] rounded-full opacity-20"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-10 right-10 w-32 h-32 bg-[#81C784] rounded-full opacity-20"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
