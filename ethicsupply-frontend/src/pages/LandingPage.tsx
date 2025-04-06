import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  LightBulbIcon,
  GlobeAltIcon,
  ChartPieIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

const LandingPage = () => {
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [treeGrowth, setTreeGrowth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);

      // Calculate tree growth based on scroll position
      if (treeContainerRef.current) {
        const { top, height } =
          treeContainerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate how much of the tree section is visible
        const visiblePortion = (viewportHeight - top) / height;
        const growth = Math.max(0, Math.min(1, visiblePortion * 1.5));

        setTreeGrowth(growth);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className="bg-neutral-50 min-h-screen">
      {/* Hero Section - Exact match to the image */}
      <div className="relative min-h-screen flex flex-col">
        {/* Top Brand Name */}
        <div className="p-4 pt-8 sm:p-6 sm:pt-12 lg:p-8 lg:pt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            EthicSupply
          </h2>
        </div>

        {/* Main Hero Content */}
        <div className="flex-grow flex">
          <div className="w-full lg:w-1/2 flex flex-col justify-center p-4 sm:p-6 lg:p-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-gray-900 mb-8">
              Ethical AI for <br />
              Smarter Supply <br />
              Chains
            </h1>
            <p className="text-xl leading-relaxed text-gray-600 max-w-xl mb-10">
              Optimize supplier selection with AI that balances efficiency,
              sustainability, and ethics.
            </p>
            <div>
              <Link
                to="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-emerald-700 hover:bg-emerald-800 transition-colors rounded-md text-white font-medium text-lg shadow-md"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hidden lg:flex w-1/2 items-center justify-center p-8">
            <div className="relative">
              <div className="w-[450px] h-[450px] rounded-full bg-emerald-100"></div>
              <img
                src="/supply-chain-illustration.svg"
                alt="Supply Chain Illustration"
                className="absolute top-0 left-0 w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  // Fallback illustration when image is not found
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
        </div>
      </div>

      {/* Updated Tree of Life Animation - Modern Design */}
      <div
        ref={treeContainerRef}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-neutral-50 to-emerald-50 overflow-hidden relative"
      >
        <div className="mx-auto max-w-7xl text-center relative z-10">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
            Growing a Sustainable Future
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            As our tree grows, so does our commitment to sustainability. Explore
            how our ethical AI helps cultivate responsible supply chains that
            nurture both business and the planet.
          </p>
        </div>

        {/* Tree Container - Modern Style */}
        <div className="h-[600px] w-full relative mx-auto max-w-7xl">
          {/* Ground */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[400px] h-[120px] bg-emerald-100 rounded-[50%] transition-opacity duration-1000"
            style={{
              opacity: treeGrowth > 0 ? 1 : 0,
            }}
          ></div>

          {/* Tree Trunk */}
          <div
            className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2 transition-all duration-1000"
            style={{
              height: `${treeGrowth * 240}px`,
              width: "20px",
              backgroundColor: "#10b981",
              borderRadius: "10px",
              opacity: treeGrowth > 0.2 ? 1 : 0,
              transformOrigin: "bottom",
            }}
          ></div>

          {/* Tree Leaves - Modern Style */}
          <div
            className="absolute bottom-[250px] left-1/2 transform -translate-x-1/2 transition-all duration-1000"
            style={{
              opacity: treeGrowth > 0.6 ? 1 : 0,
              transform: `translate(-50%, ${
                treeGrowth > 0.6 ? "0" : "30px"
              }) scale(${Math.max(0, (treeGrowth - 0.6) * 2.5)})`,
            }}
          >
            {/* A more modern, clean tree design */}
            <div className="relative">
              <div className="absolute w-40 h-40 bg-emerald-400 rounded-full opacity-90 top-[-60px] left-[-80px]"></div>
              <div className="absolute w-48 h-48 bg-emerald-500 rounded-full opacity-90 top-[-100px] left-[-40px]"></div>
              <div className="absolute w-40 h-40 bg-emerald-600 rounded-full opacity-90 top-[-60px] left-[40px]"></div>
              <div className="absolute w-32 h-32 bg-emerald-500 rounded-full opacity-90 top-[-140px] left-[-20px]"></div>
              <div className="absolute w-36 h-36 bg-emerald-400 rounded-full opacity-90 top-[-20px] left-[0px]"></div>
            </div>
          </div>

          {/* Floating Elements - More subtle and modern */}
          {treeGrowth > 0.8 && (
            <>
              <div className="absolute animate-float-slow w-6 h-6 bg-white/30 rounded-full top-1/3 left-1/3"></div>
              <div className="absolute animate-float-medium w-4 h-4 bg-white/30 rounded-full top-1/4 right-1/3"></div>
              <div className="absolute animate-float-fast w-3 h-3 bg-white/30 rounded-full top-2/5 left-2/5"></div>
            </>
          )}

          {/* Value Cards - More modern styling */}
          <div
            className="absolute top-[100px] left-1/4 transform -translate-x-1/2 transition-all duration-1000"
            style={{
              opacity: treeGrowth > 0.85 ? 1 : 0,
              transform: `translate(-50%, ${treeGrowth > 0.85 ? "0" : "20px"})`,
            }}
          >
            <div className="bg-white shadow-lg p-4 rounded-lg">
              <span className="font-medium text-emerald-700">
                Sustainability
              </span>
            </div>
          </div>

          <div
            className="absolute top-[150px] right-1/4 transform translate-x-1/2 transition-all duration-1000"
            style={{
              opacity: treeGrowth > 0.9 ? 1 : 0,
              transform: `translate(50%, ${treeGrowth > 0.9 ? "0" : "20px"})`,
            }}
          >
            <div className="bg-white shadow-lg p-4 rounded-lg">
              <span className="font-medium text-emerald-700">
                Ethical Business
              </span>
            </div>
          </div>

          <div
            className="absolute top-[200px] left-1/3 transform -translate-x-1/2 transition-all duration-1000"
            style={{
              opacity: treeGrowth > 0.95 ? 1 : 0,
              transform: `translate(-50%, ${treeGrowth > 0.95 ? "0" : "20px"})`,
            }}
          >
            <div className="bg-white shadow-lg p-4 rounded-lg">
              <span className="font-medium text-emerald-700">Transparency</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="mx-auto max-w-3xl lg:text-center mb-16">
          <div className="flex items-center justify-center mb-3">
            <ShieldCheckIcon className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-base font-semibold text-emerald-600">
            Sustainable Supply Chain Management
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to make ethical decisions
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform combines AI technology with ethical considerations to
            help you build a sustainable supply chain that meets regulatory
            requirements and contributes to a better future.
          </p>
        </div>
        <div className="responsive-grid-wide">
          {features.map((feature) => (
            <div key={feature.name} className="card flex flex-col h-full">
              <div className="rounded-lg bg-emerald-50 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <feature.icon
                  className="h-6 w-6 flex-none text-emerald-600"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.name}
              </h3>
              <p className="flex-grow text-base text-gray-600 mb-4">
                {feature.description}
              </p>
              <div className="mt-auto">
                <Link
                  to={feature.link}
                  className="text-sm font-semibold leading-6 text-emerald-600 hover:text-emerald-500 transition-colors duration-200 flex items-center"
                >
                  Learn more
                  <svg
                    className="ml-1 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 bg-emerald-50">
        <div className="mx-auto max-w-3xl lg:text-center mb-12">
          <div className="flex items-center justify-center mb-3">
            <BuildingOfficeIcon className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by leading organizations
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            See how companies are transforming their supply chains with our
            platform
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card h-full">
              <div className="flex flex-col h-full">
                <svg
                  className="h-8 w-8 text-emerald-400 mb-6"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-lg text-gray-600 flex-grow">
                  {testimonial.quote}
                </p>
                <div className="mt-6">
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.title}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
        <div className="relative px-6 py-16 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 shadow-xl sm:px-16 sm:py-24">
          <div className="relative">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to transform your supply chain?
              </h2>
              <p className="mt-6 text-lg text-emerald-50 max-w-3xl mx-auto">
                Join the growing number of companies using our platform to make
                their supply chains more ethical and sustainable.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-8 py-3 rounded-md text-base font-semibold shadow-sm bg-white text-emerald-700 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Start your journey
                </Link>
                <Link
                  to="/about"
                  className="w-full sm:w-auto px-8 py-3 rounded-md text-base font-semibold border border-white text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Learn more about us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
