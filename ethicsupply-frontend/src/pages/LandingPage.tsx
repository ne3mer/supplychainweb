import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  LightBulbIcon,
  GlobeAltIcon,
  ChartPieIcon,
  UserGroupIcon,
  ArrowPathIcon,
  CubeTransparentIcon,
} from "@heroicons/react/24/outline";

const LandingPage = () => {
  const [show3D, setShow3D] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

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

  // Testimonials data
  const testimonials = [
    {
      quote:
        "EthicSupply has transformed how we evaluate our partners. The AI-driven insights helped us improve our supply chain's sustainability by 35%.",
      author: "Sarah Johnson",
      title: "Chief Sustainability Officer",
      company: "EcoTech Solutions",
    },
    {
      quote:
        "The dashboard analytics provide invaluable insights that have helped us make informed decisions about our supplier relationships.",
      author: "Michael Chen",
      title: "VP of Procurement",
      company: "Global Innovations",
    },
    {
      quote:
        "Implementing EthicSupply's recommendations resulted in a significant improvement in our ESG ratings and reduced our environmental footprint.",
      author: "Emma Rodriguez",
      title: "Sustainability Director",
      company: "Green Future Inc.",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - Redesigned with full-width 3D visualization */}
      <div className="relative min-h-screen flex flex-col">
        {/* Top Brand Name */}
        <div className="absolute top-0 left-0 w-full z-10 p-4 sm:p-6 lg:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            EthicSupply
          </h2>
        </div>

        {/* Main Hero Content - Overlay on 3D visualization */}
        <div className="flex-grow flex">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 z-10">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-gray-900 mb-8">
              Ethical AI for <br />
              Smarter Supply <br />
              Chains
            </h1>
            <p className="text-xl leading-relaxed text-gray-600 max-w-xl mb-10">
              Optimize supplier selection with AI that balances efficiency,
              sustainability, and ethics.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-emerald-700 hover:bg-emerald-800 transition-colors rounded-md text-white font-medium text-lg shadow-md"
              >
                Get Started
              </Link>
              <button
                onClick={() => setShow3D(!show3D)}
                className="inline-flex items-center px-6 py-3 bg-white border border-emerald-700 hover:bg-emerald-50 transition-colors rounded-md text-emerald-700 font-medium text-lg shadow-md"
              >
                <CubeTransparentIcon className="w-5 h-5 mr-2" />
                {show3D ? "Hide 3D View" : "Explore 3D View"}
              </button>
            </div>
          </div>

          {/* Right Side - Always visible but shows either 3D or static */}
          <div className="hidden lg:block w-1/2 relative">
            {/* Static Image */}
            {!show3D && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[500px] h-[500px] relative">
                  <div className="w-full h-full rounded-full bg-emerald-100"></div>
                  <img
                    src="/supply-chain-illustration.svg"
                    alt="Supply Chain Illustration"
                    className="absolute top-0 left-0 w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      document
                        .getElementById("fallback-illustration")
                        ?.classList.remove("hidden");
                    }}
                  />
                  <div
                    id="fallback-illustration"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden"
                  >
                    <div className="relative">
                      {/* Warehouse */}
                      <div className="absolute top-[-120px] left-[-60px] w-[120px] h-[100px] bg-gray-300 rounded-sm">
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[40px] h-[40px] bg-gray-500"></div>
                        <div className="absolute top-0 w-full h-[20px] bg-gray-400"></div>
                      </div>

                      {/* Ground with tree */}
                      <div className="absolute top-0 left-0 w-[300px] h-[150px] bg-emerald-200 rounded-full">
                        <div className="absolute top-[-90px] left-[210px]">
                          <div className="w-[20px] h-[60px] bg-emerald-800 rounded-full"></div>
                          <div className="absolute top-[-60px] left-[-30px] w-[80px] h-[80px] bg-emerald-500 rounded-full"></div>
                        </div>

                        {/* Delivery truck */}
                        <div className="absolute top-[40px] left-[50px]">
                          <div className="w-[100px] h-[40px] bg-white rounded-sm">
                            <div className="absolute top-[10px] left-[-20px] w-[40px] h-[20px] bg-blue-400 rounded-l-md"></div>
                          </div>
                          <div className="absolute bottom-[-10px] left-[10px] w-[15px] h-[15px] rounded-full bg-gray-700"></div>
                          <div className="absolute bottom-[-10px] left-[75px] w-[15px] h-[15px] rounded-full bg-gray-700"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full-screen 3D visualization */}
        {show3D && (
          <div className="absolute inset-0 z-20">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-30">
                <div className="flex flex-col items-center">
                  <ArrowPathIcon className="w-16 h-16 text-emerald-600 animate-spin" />
                  <p className="mt-4 text-lg text-gray-700">
                    Loading 3D visualization...
                  </p>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src="/index.html"
              className="w-full h-full border-0"
              title="3D Supply Chain Visualization"
              onLoad={handleIframeLoad}
            ></iframe>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
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

      {/* Testimonials Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What Our Clients Say
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Companies around the world trust EthicSupply to optimize their
              supplier selection and improve their sustainability metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg shadow">
                <p className="text-gray-600 italic mb-6">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-gray-600">{testimonial.title}</p>
                  <p className="text-gray-500">{testimonial.company}</p>
                </div>
              </div>
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
