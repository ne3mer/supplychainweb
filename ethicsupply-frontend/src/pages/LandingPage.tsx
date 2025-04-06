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
    <div className="bg-neutral-50">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-200 to-teal-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
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
                className="rounded-md bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-colors duration-200"
              >
                Get started
              </Link>
              <Link
                to="/evaluate"
                className="text-sm font-semibold leading-6 text-emerald-700 hover:text-emerald-600 transition-colors duration-200"
              >
                Evaluate a supplier <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-emerald-300 to-teal-500 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-16">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-600">
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
                    className="h-5 w-5 flex-none text-emerald-600"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    <Link
                      to={
                        feature.name === "Dashboard Analytics"
                          ? "/dashboard"
                          : feature.name === "Supplier Evaluation"
                          ? "/evaluate"
                          : "/recommendations"
                      }
                      className="text-sm font-semibold leading-6 text-emerald-600 hover:text-emerald-500 transition-colors duration-200"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </Link>
                  </p>
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
