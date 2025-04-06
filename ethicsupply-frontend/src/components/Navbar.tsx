import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  HomeIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  LightBulbIcon,
  UserGroupIcon,
  DocumentMagnifyingGlassIcon,
  GlobeAltIcon,
  ChartBarSquareIcon,
  InformationCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const NavigationBar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Dashboard", href: "/dashboard", icon: ChartBarIcon },
    { name: "Suppliers", href: "/suppliers", icon: UserGroupIcon },
    {
      name: "Assessment",
      href: "/supplier-assessment",
      icon: DocumentMagnifyingGlassIcon,
    },
    { name: "Risk Map", href: "/geo-risk-mapping", icon: GlobeAltIcon },
    {
      name: "Supply Chain",
      href: "/supply-chain-graph",
      icon: ChartBarSquareIcon,
    },
    { name: "Recommendations", href: "/recommendations", icon: LightBulbIcon },
    { name: "About", href: "/about", icon: InformationCircleIcon },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-xl md:text-2xl font-bold text-emerald-600 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  EthicSupply
                </span>
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-4 lg:space-x-8">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "border-emerald-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-emerald-300 hover:text-emerald-700"
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 mr-1 ${
                        isActive ? "text-emerald-500" : "text-gray-400"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-emerald-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}
        id="mobile-menu"
      >
        <div className="pt-2 pb-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700"
                    : "border-l-4 border-transparent text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon
                  className={`h-5 w-5 mr-2 ${
                    isActive ? "text-emerald-500" : "text-gray-400"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
