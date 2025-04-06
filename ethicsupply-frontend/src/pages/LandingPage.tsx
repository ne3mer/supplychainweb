import { Link } from "react-router-dom";
import {
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  LightBulbIcon,
  GlobeAltIcon,
  ChartPieIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

const LandingPage = () => {
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
      {/* Hero Section */}
      <div className="relative isolate px-4 sm:px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-200 to-teal-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] clip-path-hero"
          ></div>
        </div>
        <div className="mx-auto max-w-7xl py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="gradient-text text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Ethical AI for Smarter Supply Chains
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
              Make sustainable decisions with AI-powered supplier evaluation and
              recommendations. Transform your supply chain with data-driven
              insights and ethical considerations.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto btn btn-primary btn-lg"
              >
                <ChartBarIcon className="h-5 w-5 mr-2" />
                Get started
              </Link>
              <Link
                to="/supplier-assessment"
                className="w-full sm:w-auto btn btn-outline btn-lg"
              >
                <ClipboardDocumentCheckIcon className="h-5 w-5 mr-2" />
                Evaluate a supplier
              </Link>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-emerald-300 to-teal-500 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem] clip-path-hero"
          ></div>
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
            See how companies are transforming their supply chains with our platform
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
                <p className="text-lg text-gray-600 flex-grow">{testimonial.quote}</p>
                <div className="mt-6">
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.title}, {testimonial.company}</div>
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
                Join the growing number of companies using our platform to make their supply chains more ethical and sustainable.
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
