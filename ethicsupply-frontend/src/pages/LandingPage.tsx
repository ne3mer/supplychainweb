import { Link } from "react-router-dom";
import {
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

const LandingPage = () => {
  const features = [
    {
      name: "Dashboard Analytics",
      description:
        "Get comprehensive insights into your supply chain sustainability metrics.",
      icon: ChartBarIcon,
    },
    {
      name: "Supplier Evaluation",
      description:
        "Evaluate suppliers based on ethical and environmental criteria.",
      icon: ClipboardDocumentCheckIcon,
    },
    {
      name: "AI Recommendations",
      description:
        "Receive intelligent recommendations for sustainable supplier choices.",
      icon: LightBulbIcon,
    },
  ];

  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Ethical AI for Smarter Supply Chains
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Make sustainable decisions with AI-powered supplier evaluation and
              recommendations. Transform your supply chain with data-driven
              insights and ethical considerations.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/dashboard"
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Get started
              </Link>
              <Link
                to="/evaluate"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Evaluate a supplier <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">
            Sustainable Supply Chain
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to make ethical decisions
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform combines AI technology with ethical considerations to
            help you build a sustainable supply chain.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon
                    className="h-5 w-5 flex-none text-primary-600"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
