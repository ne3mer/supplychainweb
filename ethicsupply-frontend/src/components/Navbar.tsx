import { Link, useLocation } from "react-router-dom";
import { Fragment, useState } from "react";
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
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const NavigationBar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Dashboard", href: "/dashboard", icon: ChartBarIcon },
    { name: "Suppliers", href: "/suppliers", icon: UserGroupIcon },
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
    if (profileOpen) setProfileOpen(false);
  };

  const toggleProfileMenu = () => {
    setProfileOpen(!profileOpen);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <Fragment>
      <nav className="sticky top-0 z-30 bg-[#fdf6e3] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center flex-1">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center group">
                  <span className="text-xl md:text-2xl font-bold text-gray-900 group-hover:opacity-90 transition-opacity duration-200">
                    EthicSupply
                  </span>
                </Link>
              </div>
              <div className="hidden md:ml-8 md:flex md:space-x-1 lg:space-x-4">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <item.icon
                        className={`h-5 w-5 mr-1.5 ${
                          isActive
                            ? "text-white"
                            : "text-gray-500 group-hover:text-gray-700"
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* ESG Badge */}
            <div className="flex items-center mr-4">
              <div className="bg-[#dcf3dc] border-2 border-[#81C784] text-[#2e7d32] font-bold text-sm rounded-full px-4 py-1">
                ESG
              </div>
            </div>

            {/* User profile menu */}
            <div className="hidden md:flex items-center">
              <div className="relative ml-3">
                <button
                  type="button"
                  className="flex text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 p-1"
                  onClick={toggleProfileMenu}
                >
                  <span className="sr-only">Open user menu</span>
                  <UserCircleIcon className="h-7 w-7 text-gray-700" />
                </button>

                {profileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 transition-all duration-200 transform opacity-100 scale-100">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setProfileOpen(false)}
                    >
                      <UserCircleIcon className="h-4 w-4 mr-2 text-gray-500" />
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Cog6ToothIcon className="h-4 w-4 mr-2 text-gray-500" />
                      Settings
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setProfileOpen(false)}
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2 text-gray-500" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? "max-h-[500px] border-t border-gray-200"
              : "max-h-0"
          }`}
          id="mobile-menu"
        >
          <div className="pt-2 pb-3 space-y-1 px-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon
                    className={`h-5 w-5 mr-3 ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile ESG Badge */}
            <div className="py-2">
              <div className="bg-[#dcf3dc] border-2 border-[#81C784] text-[#2e7d32] font-bold text-sm rounded-full px-4 py-1 inline-block">
                ESG
              </div>
            </div>

            {/* Mobile profile options */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <UserCircleIcon className="h-10 w-10 text-gray-700" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    Admin User
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    admin@ethicsupply.com
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Your Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay for profile menu on desktop */}
      {profileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-20 hidden md:block"
          onClick={() => setProfileOpen(false)}
        ></div>
      )}
    </Fragment>
  );
};

export default NavigationBar;
