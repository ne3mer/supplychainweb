import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Globe,
  Users,
  ChevronDown,
  Menu,
  X,
  Search,
  Settings,
  LogOut,
  AlertCircle,
  Activity,
  Sun,
  Moon,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Apply dark mode from localStorage
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false);
    setActiveGroup(null);
  }, [location.pathname]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleGroup = (group: string) => {
    setActiveGroup(activeGroup === group ? null : group);
  };

  const navItems = [
    {
      group: "Suppliers",
      icon: <Users className="h-5 w-5" />,
      links: [
        { name: "Suppliers List", path: "/suppliers" },
        { name: "Add Supplier", path: "/add-supplier" },
        { name: "Evaluate Supplier", path: "/evaluate-supplier" },
      ],
    },
    {
      group: "Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      links: [
        { name: "Supplier Analytics", path: "/supplier-analytics" },
        { name: "Supplier Scorecard", path: "/supplier-scorecard" },
        { name: "Recommendations", path: "/recommendations" },
      ],
    },
    {
      group: "Visualization",
      icon: <Globe className="h-5 w-5" />,
      links: [
        { name: "Supply Chain Graph", path: "/supply-chain-graph" },
        { name: "Geographic Risk Mapping", path: "/geo-risk-mapping" },
      ],
    },
  ];

  const isActivePath = (path: string) => location.pathname === path;
  const isActiveGroup = (group: string) =>
    navItems
      .find((item) => item.group === group)
      ?.links.some((link) => isActivePath(link.path)) ?? false;

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 fixed w-full z-50 transition-colors duration-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and brand */}
            <div className="flex items-center">
              <Link to="/dashboard" className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-md flex items-center justify-center mr-2">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">
                  EthicSupply
                </span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center md:space-x-2">
              {navItems.map((item) => (
                <div key={item.group} className="relative group">
                  <button
                    onClick={() => toggleGroup(item.group)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActiveGroup(item.group) || activeGroup === item.group
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                    }`}
                  >
                    <span className="mr-1.5">{item.icon}</span>
                    {item.group}
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                        activeGroup === item.group ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown menu */}
                  {activeGroup === item.group && (
                    <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 transition-all duration-200 z-10">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        {item.links.map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                              isActivePath(link.path)
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                            }`}
                            role="menuitem"
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center">
              {/* Search button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="ml-2 p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* Settings */}
              <button className="ml-2 p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800">
                <Settings className="h-5 w-5" />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="ml-2 md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search overlay */}
        {isSearchOpen && (
          <div className="w-full border-t border-gray-200 dark:border-gray-700 py-3 px-4 bg-white dark:bg-gray-900">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 ease-in-out"
                placeholder="Search suppliers, analytics, etc."
                type="search"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <div key={item.group} className="space-y-1">
                  <button
                    onClick={() => toggleGroup(item.group)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium ${
                      isActiveGroup(item.group)
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      {item.group}
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-200 ${
                        activeGroup === item.group ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeGroup === item.group && (
                    <div className="pl-10 space-y-1">
                      {item.links.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className={`block px-3 py-2 rounded-md text-base font-medium ${
                            isActivePath(link.path)
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                          }`}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="px-2 space-y-1">
                <button className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </button>
                <button className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                  <AlertCircle className="mr-3 h-5 w-5" />
                  Help
                </button>
                <button className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      {/* Add spacer to prevent content from hiding under the fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
