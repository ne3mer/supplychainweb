import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  LightBulbIcon,
  GlobeAltIcon,
  ChartPieIcon,
  UserGroupIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const LandingPage = () => {
  const [isHovering, setIsHovering] = useState(false);

  // Features section data
  const features = [
    {
      name: "Dashboard Analytics",
      description:
        "Get comprehensive insights into your supply chain sustainability metrics with interactive visualizations.",
      icon: ChartBarIcon,
      link: "/dashboard",
    },
    {
      name: "Supplier Evaluation",
      description:
        "Evaluate suppliers based on ethical, environmental, social, and governance criteria using AI-driven analytics.",
      icon: ClipboardDocumentCheckIcon,
      link: "/supplier-assessment",
    },
    {
      name: "AI Recommendations",
      description:
        "Receive intelligent recommendations for sustainable supplier choices backed by machine learning.",
      icon: LightBulbIcon,
      link: "/recommendations",
    },
    {
      name: "Global Risk Mapping",
      description:
        "Visualize geographical risk factors affecting your supply chain around the world.",
      icon: GlobeAltIcon,
      link: "/geo-risk-mapping",
    },
    {
      name: "Supplier Network",
      description:
        "Analyze your entire supplier network with comprehensive supply chain graphs and visualizations.",
      icon: ChartPieIcon,
      link: "/supply-chain-graph",
    },
    {
      name: "Supplier Directory",
      description:
        "Access detailed profiles, scores, and analytics for all your suppliers in one centralized location.",
      icon: UserGroupIcon,
      link: "/suppliers",
    },
  ];

  return (
    <div className="bg-[#fdf6e3] min-h-screen">
      {/* Hero Section - Minimalist design with centered content */}
      <div className="relative min-h-screen flex flex-col">
        {/* Top ESG Badge */}
        <div className="absolute top-4 right-6 sm:top-8 sm:right-12 z-10">
          <div className="bg-[#dcf3dc] border-2 border-[#81C784] text-[#2e7d32] font-bold text-sm rounded-full px-4 py-1">
            ESG
          </div>
        </div>

        {/* Main Content - Centered with illustration */}
        <div className="flex-grow flex flex-col items-center justify-center px-4 text-center relative">
          <div className="max-w-4xl mx-auto z-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4">
              EthicSupply
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-8">
              Ethical AI-Powered Supply Chain Optimization
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-10">
              Optimize supplier selection with AI that balances efficiency,
              sustainability, and ethics.
            </p>

            {/* CTA Button */}
            <div className="mt-8">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 hover:bg-gray-800 transition-colors rounded-full text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-transform duration-300"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                Get Started
                <ArrowRightIcon
                  className={`ml-2 w-5 h-5 transition-transform duration-300 ${
                    isHovering ? "translate-x-1" : ""
                  }`}
                />
              </Link>
            </div>
          </div>

          {/* Illustration */}
          <div className="w-full max-w-5xl mx-auto mt-12">
            <img
              src="/modern-illustration.svg"
              alt="Ethical AI Supply Chain Illustration"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Sustainable Supply Chain Management
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform gives you the tools to make ethical
              supplier choices while maintaining efficiency and
              cost-effectiveness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-md mb-4">
                  <feature.icon
                    className="h-6 w-6 text-emerald-700"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.name}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-emerald-700">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to transform your supply chain?
          </h2>
          <p className="mt-4 text-lg text-emerald-100 max-w-3xl mx-auto">
            Join the growing community of businesses making ethical supplier
            decisions with the power of AI and data analytics.
          </p>
          <div className="mt-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-100 transition-colors rounded-md text-emerald-700 font-semibold text-lg shadow-md"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
