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
  Github,
  Linkedin,
  Mail,
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
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7ff] to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-block bg-[#e0edff] border-2 border-[#3b82f6] rounded-full px-4 py-1 mb-6">
              <span className="text-[#1e40af] font-medium">ESG Focused</span>
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
                  className="bg-[#1e40af] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#1e3a8a] transition-colors"
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
                  <Element.icon className="w-8 h-8 text-[#3b82f6]" />
                </motion.div>
                {index < flowElements.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: Element.delay + 0.1, duration: 0.3 }}
                  >
                    <ArrowRight className="w-6 h-6 text-[#3b82f6]" />
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
              className="absolute -top-1/2 -left-1/2 w-full h-full border-[40px] border-[#e0edff] rounded-full"
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
              className="absolute -bottom-1/2 -right-1/2 w-full h-full border-[40px] border-[#3b82f6] rounded-full opacity-20"
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
                className="text-[#3b82f6] mb-4"
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
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white py-16">
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
              <div className="text-blue-200">Optimization Rate</div>
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
              <div className="text-blue-200">Real-time Monitoring</div>
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
              <div className="text-blue-200">Cost Reduction</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* About the Author Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-8 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-8"
        >
          <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0">
            <img
              src="https://via.placeholder.com/200x200"
              alt="Author"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">About Me</h3>
            <p className="text-gray-600 mb-4">
              Hi, I'm Nima Afshar Far. I'm a passionate developer focused on
              creating ethical AI solutions for supply chain optimization. With
              a background in both AI and supply chain management, I've
              developed EthicSupply to address the growing need for sustainable
              and ethical business practices in global supply chains.
            </p>
            <p className="text-gray-600 mb-6">
              My mission is to help companies make better decisions about their
              supply networks by considering not just efficiency and cost, but
              also environmental impact, social responsibility, and ethical
              governance.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/ne3mer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3b82f6] hover:text-[#1e40af]"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3b82f6] hover:text-[#1e40af]"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="mailto:contact@ethicsupply.com"
                className="text-[#3b82f6] hover:text-[#1e40af]"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative overflow-hidden">
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
              className="bg-[#1e40af] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#1e3a8a] transition-colors"
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
            className="absolute top-10 left-10 w-20 h-20 bg-[#e0edff] rounded-full opacity-20"
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
            className="absolute bottom-10 right-10 w-32 h-32 bg-[#3b82f6] rounded-full opacity-20"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">EthicSupply</h3>
              <p className="text-gray-400 text-sm">
                Revolutionizing supply chain management with ethical AI
                solutions.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Supplier Evaluation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Analytics
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Geo Risk Mapping
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>contact@ethicsupply.com</li>
                <li>+1 (123) 456-7890</li>
                <li>123 Innovation Way, Tech City, 12345</li>
              </ul>
              <div className="flex gap-4 mt-4">
                <a
                  href="https://github.com/ne3mer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-300"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-300"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="mailto:contact@ethicsupply.com"
                  className="text-gray-400 hover:text-blue-300"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
            <p>
              © {new Date().getFullYear()} EthicSupply. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
