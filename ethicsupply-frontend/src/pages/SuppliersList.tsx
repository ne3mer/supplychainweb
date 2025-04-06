import { useState, useEffect } from "react";
import { getSuppliers } from "../services/api";
import { Link } from "react-router-dom";
import {
  UserGroupIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ChartBarIcon,
  PlusCircleIcon,
  DocumentMagnifyingGlassIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

const SuppliersList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("ethical_score");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const data = await getSuppliers();
        console.log(`Suppliers data received: ${data.length} suppliers`, data);
        setSuppliers(data);
        setError(null);

        // Check explicitly if we're using mock data based on flag
        // Set usingMockData to false by default - only true if explicitly flagged
        if (data && Array.isArray(data) && data.length > 0) {
          // Look for the isMockData flag on the first supplier
          const isMock = data[0].isMockData === true;
          console.log("Using mock data:", isMock);
          setUsingMockData(isMock);
        } else {
          setUsingMockData(false);
        }
      } catch (err) {
        console.error("Error fetching suppliers:", err);
        setError(
          `Failed to fetch suppliers: ${
            err.message || "Unknown error"
          }. Please try again later.`
        );
        setUsingMockData(true); // Likely using mock data if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedSuppliers = suppliers
    .filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.country.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let valueA = a[sortField] || 0;
      let valueB = b[sortField] || 0;

      if (typeof valueA === "string") valueA = valueA.toLowerCase();
      if (typeof valueB === "string") valueB = valueB.toLowerCase();

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const getScoreColor = (score) => {
    if (score === null || score === undefined) return "bg-gray-200";
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreIcon = (score) => {
    if (score === null || score === undefined) return null;
    if (score >= 80)
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    if (score >= 60)
      return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
    return <XCircleIcon className="h-5 w-5 text-red-500" />;
  };

  const getMetricBarColor = (value, isInverted = false) => {
    if (value === null || value === undefined) return "bg-gray-200";

    if (!isInverted) {
      if (value >= 0.8) return "bg-green-500";
      if (value >= 0.6) return "bg-green-400";
      if (value >= 0.4) return "bg-yellow-500";
      if (value >= 0.2) return "bg-orange-500";
      return "bg-red-500";
    } else {
      if (value <= 20) return "bg-green-500";
      if (value <= 40) return "bg-green-400";
      if (value <= 60) return "bg-yellow-500";
      if (value <= 80) return "bg-orange-500";
      return "bg-red-500";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Suppliers</h1>
          <p className="mt-2 text-sm text-gray-700">Loading suppliers...</p>
        </div>
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && suppliers.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Suppliers</h1>
          <p className="mt-2 text-sm text-gray-700">Error loading suppliers</p>
        </div>
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-neutral-50">
      <div className="px-4 py-6 bg-gradient-to-r from-emerald-700 to-teal-700 rounded-lg shadow-md text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Supplier Network</h1>
            <p className="mt-2 text-emerald-100">
              View and analyze your supplier network's ethical and
              sustainability performance
            </p>
          </div>
          <Link
            to="/add-supplier"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400"
          >
            <PlusCircleIcon className="h-5 w-5 mr-1" /> Add New Supplier
          </Link>
        </div>
      </div>

      {usingMockData && (
        <div className="rounded-md bg-blue-50 p-4 border-l-4 border-blue-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <InformationCircleIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Demo Mode</h3>
              <div className="mt-2 text-sm text-blue-700">
                You are viewing demo data. The API endpoint is not available at
                this time. All actions will work with sample data.
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-yellow-50 p-4 border-l-4 border-yellow-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-lg">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between">
            <div className="mt-2 sm:mt-0 relative rounded-md shadow-sm max-w-xs w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search suppliers..."
              />
            </div>
            <div className="mt-2 sm:mt-0 flex items-center">
              <span className="text-sm text-gray-700 mr-2">Sort by:</span>
              <div className="relative">
                <select
                  value={sortField}
                  onChange={(e) => handleSort(e.target.value)}
                  className="focus:ring-emerald-500 focus:border-emerald-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-700 sm:text-sm rounded-md"
                >
                  <option value="ethical_score">Ethical Score</option>
                  <option value="name">Name</option>
                  <option value="country">Country</option>
                  <option value="co2_emissions">CO2 Emissions</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <AdjustmentsHorizontalIcon className="h-4 w-4 text-gray-500" />
                </div>
              </div>
              <button
                onClick={() =>
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                }
                className="ml-2 p-1 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                {sortDirection === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="col-span-2 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      <span>Supplier</span>
                      <span className="ml-1">{getSortIcon("name")}</span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("country")}
                  >
                    <div className="flex items-center">
                      <span>Country</span>
                      <span className="ml-1">{getSortIcon("country")}</span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("ethical_score")}
                  >
                    <div className="flex items-center">
                      <span>Ethical Score</span>
                      <span className="ml-1">
                        {getSortIcon("ethical_score")}
                      </span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("co2_emissions")}
                  >
                    <div className="flex items-center">
                      <span>CO₂ Emissions</span>
                      <span className="ml-1">
                        {getSortIcon("co2_emissions")}
                      </span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    onClick={() => setSelectedSupplier(supplier)}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedSupplier?.id === supplier.id
                        ? "bg-primary-50"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <UserGroupIcon className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {supplier.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {supplier.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {supplier.country}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getScoreIcon(supplier.ethical_score)}
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {supplier.ethical_score !== null
                            ? `${supplier.ethical_score.toFixed(1)}%`
                            : "Not evaluated"}
                        </span>
                      </div>
                      <div className="w-full mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getScoreColor(
                            supplier.ethical_score
                          )}`}
                          style={{
                            width: `${supplier.ethical_score || 0}%`,
                          }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {supplier.co2_emissions.toFixed(1)} t
                      </div>
                      <div className="w-full mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={getMetricBarColor(
                            supplier.co2_emissions,
                            true
                          )}
                          style={{
                            width: `${Math.min(supplier.co2_emissions, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/supplier-assessment?id=${supplier.id}`}
                        className="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded text-white bg-emerald-600 hover:bg-emerald-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ClipboardDocumentCheckIcon className="h-4 w-4 mr-1" />
                        Assess
                      </Link>
                      <Link
                        to={`/suppliers/${supplier.id}`}
                        className="text-primary-600 hover:text-primary-900 ml-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredAndSortedSuppliers.length === 0 && (
                  <tr>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                      colSpan={5}
                    >
                      No suppliers found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-gray-200">
            {selectedSupplier ? (
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {selectedSupplier.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedSupplier.country}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-medium text-gray-700">
                      Ethical Score
                    </h4>
                    <span className="text-lg font-bold text-gray-900">
                      {selectedSupplier.ethical_score !== null
                        ? `${selectedSupplier.ethical_score.toFixed(1)}%`
                        : "Not evaluated"}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getScoreColor(
                        selectedSupplier.ethical_score
                      )}`}
                      style={{
                        width: `${selectedSupplier.ethical_score || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Sustainability Metrics
                  </h4>

                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs text-gray-500">
                        CO₂ Emissions
                      </span>
                      <span className="text-sm font-medium">
                        {selectedSupplier.co2_emissions.toFixed(1)} t
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={getMetricBarColor(
                          selectedSupplier.co2_emissions,
                          true
                        )}
                        style={{
                          width: `${Math.min(
                            selectedSupplier.co2_emissions,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs text-gray-500">
                        Delivery Efficiency
                      </span>
                      <span className="text-sm font-medium">
                        {selectedSupplier.delivery_efficiency.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={getMetricBarColor(
                          selectedSupplier.delivery_efficiency
                        )}
                        style={{
                          width: `${
                            selectedSupplier.delivery_efficiency * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs text-gray-500">
                        Wage Fairness
                      </span>
                      <span className="text-sm font-medium">
                        {selectedSupplier.wage_fairness.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={getMetricBarColor(
                          selectedSupplier.wage_fairness
                        )}
                        style={{
                          width: `${selectedSupplier.wage_fairness * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs text-gray-500">
                        Human Rights Index
                      </span>
                      <span className="text-sm font-medium">
                        {selectedSupplier.human_rights_index.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={getMetricBarColor(
                          selectedSupplier.human_rights_index
                        )}
                        style={{
                          width: `${
                            selectedSupplier.human_rights_index * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs text-gray-500">
                        Waste Management
                      </span>
                      <span className="text-sm font-medium">
                        {selectedSupplier.waste_management_score.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={getMetricBarColor(
                          selectedSupplier.waste_management_score
                        )}
                        style={{
                          width: `${
                            selectedSupplier.waste_management_score * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col space-y-2">
                  <Link
                    to={`/supplier-assessment?id=${selectedSupplier.id}`}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <ClipboardDocumentCheckIcon className="h-4 w-4 mr-1" />{" "}
                    Comprehensive Assessment
                  </Link>
                  <Link
                    to={`/supplier-analytics/${selectedSupplier.id}`}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <DocumentMagnifyingGlassIcon className="h-4 w-4 mr-1" /> AI
                    Analytics
                  </Link>
                  <Link
                    to={`/suppliers/${selectedSupplier.id}`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1" /> View
                    Details
                  </Link>
                  <Link
                    to={`/suppliers/${selectedSupplier.id}/scorecard`}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <ChartBarIcon className="h-4 w-4 mr-1" /> Ethical Scorecard
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 flex items-center justify-center h-full text-center">
                <div>
                  <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto" />
                  <p className="mt-2 text-sm text-gray-500">
                    Select a supplier to view details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppliersList;
