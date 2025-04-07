import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import {
  Brain,
  Zap,
  Globe,
  BarChart3,
  Leaf,
  Shield,
  Network,
  Link as LinkIcon,
  Github,
  Linkedin,
  Mail,
  ArrowDown,
  ChevronRight,
} from "lucide-react";

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const scrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const treeContainerRef = useRef(null);
  const [treeHeight, setTreeHeight] = useState(0);

  // Update tree height based on scroll position
  useEffect(() => {
    const updateTreeHeight = () => {
      if (treeContainerRef.current) {
        const scrollPos = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.body.scrollHeight;
        const maxScroll = docHeight - windowHeight;
        const scrollPercentage = Math.min(scrollPos / maxScroll, 1);
        setTreeHeight(scrollPercentage * 100); // 0-100%
      }
    };

    window.addEventListener("scroll", updateTreeHeight);
    updateTreeHeight(); // Initial call

    return () => window.removeEventListener("scroll", updateTreeHeight);
  }, []);

  // Branch rotation based on scroll
  const leftBranchRotate = useTransform(scrollProgress, [0, 1], [-10, 10]);
  const rightBranchRotate = useTransform(scrollProgress, [0, 1], [10, -10]);

  // Leaf opacity based on scroll
  const leafOpacity = useTransform(scrollProgress, [0, 0.5, 1], [0, 1, 0.8]);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms for ethical supply chain optimization",
      color: "from-purple-500 to-indigo-600",
      delay: 0.1,
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Ethical Scoring",
      description: "Comprehensive ESG evaluation of all supply partners",
      color: "from-emerald-500 to-teal-600",
      delay: 0.2,
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Risk Mapping",
      description: "Real-time visualization of supply chain vulnerabilities",
      color: "from-blue-500 to-cyan-600",
      delay: 0.3,
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Predictive Insights",
      description: "Forecasting potential disruptions before they occur",
      color: "from-amber-500 to-orange-600",
      delay: 0.4,
    },
    {
      icon: <Network className="w-8 h-8" />,
      title: "Network Visualization",
      description: "Interactive supply chain relationship modeling",
      color: "from-pink-500 to-rose-600",
      delay: 0.5,
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Performance Analytics",
      description: "Comprehensive insights into supplier performance",
      color: "from-violet-500 to-purple-600",
      delay: 0.6,
    },
  ];

  // Dynamic tree of life component that animates with scrolling
  const TreeOfLife = () => (
    <div
      ref={treeContainerRef}
      className="absolute left-0 top-0 h-full w-full overflow-hidden pointer-events-none"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Tree trunk */}
        <motion.path
          d="M50,100 L50,60"
          stroke="#8B5CF6"
          strokeWidth="2"
          fill="none"
          style={{
            pathLength: treeHeight / 100,
            opacity: treeHeight > 10 ? 1 : 0,
          }}
        />

        {/* Left branches */}
        <motion.path
          d="M50,60 C30,50 20,30 10,20"
          stroke="#8B5CF6"
          strokeWidth="1.5"
          fill="none"
          style={{
            pathLength: Math.max(0, (treeHeight - 20) / 80),
            opacity: treeHeight > 20 ? 1 : 0,
            rotate: leftBranchRotate,
          }}
        />

        <motion.path
          d="M50,75 C35,70 25,60 15,50"
          stroke="#8B5CF6"
          strokeWidth="1.5"
          fill="none"
          style={{
            pathLength: Math.max(0, (treeHeight - 30) / 70),
            opacity: treeHeight > 30 ? 1 : 0,
            rotate: leftBranchRotate,
          }}
        />

        {/* Right branches */}
        <motion.path
          d="M50,60 C70,50 80,30 90,20"
          stroke="#8B5CF6"
          strokeWidth="1.5"
          fill="none"
          style={{
            pathLength: Math.max(0, (treeHeight - 20) / 80),
            opacity: treeHeight > 20 ? 1 : 0,
            rotate: rightBranchRotate,
          }}
        />

        <motion.path
          d="M50,75 C65,70 75,60 85,50"
          stroke="#8B5CF6"
          strokeWidth="1.5"
          fill="none"
          style={{
            pathLength: Math.max(0, (treeHeight - 30) / 70),
            opacity: treeHeight > 30 ? 1 : 0,
            rotate: rightBranchRotate,
          }}
        />

        {/* Leaves */}
        {Array.from({ length: 12 }).map((_, i) => {
          const x = i % 2 === 0 ? 30 + i * 5 : 70 - i * 5;
          const y = 20 + i * 3;
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill={`hsl(${i * 20 + 180}, 80%, 60%)`}
              style={{
                opacity: treeHeight > 40 ? leafOpacity : 0,
                scale: useTransform(
                  scrollProgress,
                  [0, 1],
                  [0.8, 1.2 + (i % 3) * 0.2]
                ),
              }}
            />
          );
        })}

        {/* Leaves pulsing animation */}
        {Array.from({ length: 15 }).map((_, i) => {
          const angle = (i / 15) * Math.PI * 2;
          const radius = 15 + (i % 5) * 3;
          const x = 50 + Math.cos(angle) * radius;
          const y = 30 + Math.sin(angle) * radius;

          return (
            <motion.circle
              key={`pulse-${i}`}
              cx={x}
              cy={y}
              r="1.5"
              fill={`hsl(${i * 25 + 120}, 80%, 60%)`}
              style={{
                opacity: treeHeight > 60 ? leafOpacity : 0,
                scale: useTransform(
                  scrollProgress,
                  [0, 0.5, 1],
                  [0.5, 1 + (i % 4) * 0.3, 0.7]
                ),
              }}
            />
          );
        })}
      </svg>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Particle background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-20"
            style={{
              width: Math.random() * 6 + 2 + "px",
              height: Math.random() * 6 + 2 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              scale: useTransform(
                scrollProgress,
                [0, 1],
                [0.8, 1.2 + Math.random()]
              ),
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Dynamic Tree of Life */}
      <TreeOfLife />

      {/* Hero Section */}
      <div className="relative pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="inline-block bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1 rounded-full mb-8">
              <span className="text-white font-medium tracking-wide">
                ETHICAL SUPPLY CHAIN
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              EthicSupply
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transforming supply chains with AI-powered ethical intelligence
            </p>
            <motion.div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-medium hover:shadow-lg transition-all"
                >
                  Explore Platform
                </motion.button>
              </Link>
              <a href="#features">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-lg border border-purple-500 text-purple-400 text-lg font-medium hover:bg-purple-900/20 transition-all"
                >
                  Learn More
                </motion.button>
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="hidden md:block"
          >
            <ArrowDown className="w-8 h-8 mx-auto text-purple-400" />
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div
        id="features"
        ref={ref}
        className="max-w-7xl mx-auto px-4 sm:px-6 py-24"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-white"
        >
          Advanced Features
        </motion.h2>
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, delay: feature.delay }}
              className="bg-gradient-to-br bg-opacity-10 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl border border-gray-800 transition-all"
              style={{
                background: `linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(16, 16, 32, 0.6))`,
              }}
            >
              <div
                className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-4`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 backdrop-blur-sm"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-8 rounded-2xl backdrop-blur-sm bg-white/5 border border-purple-500/20"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
              >
                98%
              </motion.div>
              <div className="text-gray-300 font-medium">Optimization Rate</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-8 rounded-2xl backdrop-blur-sm bg-white/5 border border-blue-500/20"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500"
              >
                24/7
              </motion.div>
              <div className="text-gray-300 font-medium">
                Real-time Monitoring
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-8 rounded-2xl backdrop-blur-sm bg-white/5 border border-emerald-500/20"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500"
              >
                50%
              </motion.div>
              <div className="text-gray-300 font-medium">Cost Reduction</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* About the Creator Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-sm bg-gradient-to-r from-purple-900/10 to-indigo-900/10 p-8 rounded-2xl shadow-xl border border-gray-800 flex flex-col md:flex-row items-center gap-8"
        >
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-purple-500/30 flex-shrink-0 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/70 to-pink-500/70 mix-blend-overlay"></div>
            <img
              src="https://via.placeholder.com/200x200"
              alt="Creator"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              The Innovator Behind EthicSupply
            </h3>
            <p className="text-gray-300 mb-4">
              Hi, I'm Nima Afshar Far. With expertise in AI and supply chain
              management, I created EthicSupply to revolutionize how businesses
              approach supply chain ethics. My mission is to merge cutting-edge
              technology with responsible business practices.
            </p>
            <p className="text-gray-300 mb-6">
              At the heart of my vision is a desire to help companies build more
              resilient, ethical, and sustainable supply networks—where
              decisions balance financial goals with environmental and social
              responsibility.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/ne3mer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="mailto:contact@ethicsupply.com"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h2 className="text-4xl font-bold mb-8 text-white">
            Ready to Transform Your Supply Chain?
          </h2>
          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-medium hover:shadow-lg transition-all"
            >
              Get Started Today
            </motion.button>
          </Link>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-10 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-10 blur-3xl"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black pt-16 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">EthicSupply</h3>
              <p className="text-gray-400 text-sm mb-6">
                Pioneering ethical supply chains through advanced AI and data
                analytics.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://github.com/ne3mer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="mailto:contact@ethicsupply.com"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4 text-white">
                Platform
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 flex items-center"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 flex items-center"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Supplier Evaluation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 flex items-center"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Analytics
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 flex items-center"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Risk Mapping
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4 text-white">
                Resources
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 flex items-center"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 flex items-center"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 flex items-center"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Case Studies
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 flex items-center"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4 text-white">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li>contact@ethicsupply.com</li>
                <li>+1 (123) 456-7890</li>
                <li>123 Innovation Way, Tech City, 12345</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
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
