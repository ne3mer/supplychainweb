import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  LightBulbIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const NavigationBar = () => {
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Dashboard", href: "/dashboard", icon: ChartBarIcon },
    { name: "Suppliers", href: "/suppliers", icon: UserGroupIcon },
    { name: "Evaluate", href: "/evaluate", icon: ClipboardDocumentCheckIcon },
    { name: "Recommendations", href: "/recommendations", icon: LightBulbIcon },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-600">
                EthicSupply
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? "border-primary-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-1" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-base font-medium ${
                  isActive
                    ? "bg-primary-50 border-l-4 border-primary-500 text-primary-700"
                    : "border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                }`}
              >
                <item.icon className="h-5 w-5 mr-2" />
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
