import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useInView } from "react-intersection-observer";
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
  Phone,
  MapPin,
  User,
  School,
} from "lucide-react";

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const scrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const { ref, inView } = useInView({
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

  // Pre-calculate transform values for leaves
  const leafScales = Array.from({ length: 12 }).map((_, i) =>
    useTransform(scrollProgress, [0, 1], [0.8, 1.2 + (i % 3) * 0.2])
  );

  // Pre-calculate transform values for pulsing leaves
  const pulsingLeafScales = Array.from({ length: 15 }).map((_, i) =>
    useTransform(scrollProgress, [0, 0.5, 1], [0.5, 1 + (i % 4) * 0.3, 0.7])
  );

  // Pre-calculate particle scales
  const particleScales = Array.from({ length: 50 }).map((_, i) =>
    useTransform(scrollProgress, [0, 1], [0.8, 1.2 + Math.random()])
  );

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
          stroke="#10B981"
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
          stroke="#10B981"
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
          stroke="#10B981"
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
          stroke="#10B981"
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
          stroke="#10B981"
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
              fill={`hsl(${150 + i * 5}, 80%, ${50 + (i % 3) * 5}%)`}
              style={{
                opacity: treeHeight > 40 ? leafOpacity : 0,
                scale: leafScales[i],
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
              fill={`hsl(${145 + i * 3}, 80%, ${55 + (i % 4) * 5}%)`}
              style={{
                opacity: treeHeight > 60 ? leafOpacity : 0,
                scale: pulsingLeafScales[i],
              }}
            />
          );
        })}
      </svg>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950 text-white overflow-hidden">
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
              scale: particleScales[i],
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
      <div className="relative pt-16 md:pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 md:mb-16"
          >
            <div className="inline-block bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1 rounded-full mb-6 md:mb-8">
              <span className="text-white text-sm md:text-base font-medium tracking-wide">
                ETHICAL SUPPLY CHAIN
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              EthicSupply
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto">
              Transforming supply chains with AI-powered ethical intelligence
            </p>
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-6 md:px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-base md:text-lg font-medium hover:shadow-lg transition-all"
                >
                  Explore Platform
                </motion.button>
              </Link>
              <a href="#features">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-6 md:px-8 py-3 rounded-lg border border-purple-500 text-purple-400 text-base md:text-lg font-medium hover:bg-purple-900/20 transition-all"
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
        className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-white"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, delay: feature.delay }}
              className="bg-gradient-to-br bg-opacity-10 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl border border-indigo-900/40 transition-all"
              style={{
                background: `linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(16, 16, 32, 0.7))`,
              }}
            >
              <div
                className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-4`}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/40 to-indigo-900/40 backdrop-blur-sm"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 text-center"
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

      {/* How It Works Section - Replaced personal section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How EthicSupply Works
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Our platform leverages AI and data analytics to transform how
            businesses approach supply chain management, focusing on ethics,
            sustainability, and performance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="backdrop-blur-sm bg-gradient-to-r from-purple-900/10 to-indigo-900/10 p-6 rounded-2xl shadow-lg border border-gray-800"
          >
            <div className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
              1
            </div>
            <h3 className="text-xl font-bold text-white mb-3 text-center">
              Connect Your Supply Chain
            </h3>
            <p className="text-gray-300 text-center mb-4">
              Import your supplier data or connect directly to your existing
              systems to create a comprehensive view of your entire supply
              network.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                <span>Data import from multiple sources</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                <span>API integration capabilities</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                <span>Automated data cleaning</span>
              </li>
            </ul>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="backdrop-blur-sm bg-gradient-to-r from-blue-900/10 to-indigo-900/10 p-6 rounded-2xl shadow-lg border border-gray-800"
          >
            <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
              2
            </div>
            <h3 className="text-xl font-bold text-white mb-3 text-center">
              Analyze & Score Suppliers
            </h3>
            <p className="text-gray-300 text-center mb-4">
              Our AI evaluates each supplier against 30+ ethical and
              sustainability metrics, generating comprehensive scores and
              insights.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                <span>Environmental impact assessment</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                <span>Social responsibility evaluation</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                <span>Governance and compliance checks</span>
              </li>
            </ul>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="backdrop-blur-sm bg-gradient-to-r from-emerald-900/10 to-teal-900/10 p-6 rounded-2xl shadow-lg border border-gray-800"
          >
            <div className="h-14 w-14 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
              3
            </div>
            <h3 className="text-xl font-bold text-white mb-3 text-center">
              Optimize & Improve
            </h3>
            <p className="text-gray-300 text-center mb-4">
              Receive actionable recommendations to improve your supply chain's
              ethical performance and minimize risks.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                <span>Risk prediction and mitigation</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                <span>AI-generated improvement plans</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                <span>Impact simulation tools</span>
              </li>
            </ul>
          </motion.div>
        </div>
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

      {/* Creator Card - Replaces Footer */}
      <div className="py-16 bg-gradient-to-t from-black to-transparent">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-md bg-gradient-to-r from-emerald-900/20 to-indigo-900/20 p-8 rounded-2xl shadow-xl border border-emerald-500/30 overflow-hidden relative"
          >
            {/* Decorative elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-emerald-500/20 blur-2xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/20 blur-2xl"></div>

            <div className="relative flex flex-col items-center text-center z-10">
              <h3 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
                Nima Afshar Far
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl mx-auto mt-6">
                <div className="flex items-center justify-center md:justify-end gap-3">
                  <User className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">
                    Supervisor: Dr. Péter Nagy
                  </span>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">+36 70 402 6493</span>
                </div>

                <div className="flex items-center justify-center md:justify-end gap-3">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">Budapest, Hungary</span>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-3">
                  <School className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">
                    Budapest Metropolitan University
                  </span>
                </div>
              </div>

              <p className="text-gray-400 text-sm mt-8">
                © {new Date().getFullYear()} EthicSupply. All rights reserved.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
