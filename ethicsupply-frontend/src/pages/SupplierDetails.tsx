import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getSuppliers } from "../services/api";
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const SupplierDetails = () => {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        setLoading(true);
        const suppliers = await getSuppliers();
        console.log("Suppliers data for details:", suppliers);
        const foundSupplier = suppliers.find((s) => s.id === parseInt(id, 10));

        if (foundSupplier) {
          setSupplier(foundSupplier);
          console.log("Found supplier:", foundSupplier);

          // Check if using mock data based on flag
          const isMock = foundSupplier.isMockData === true;
          console.log("Using mock data for supplier details:", isMock);
          setUsingMockData(isMock);
        } else {
          setError(`Supplier with ID ${id} not found`);
        }
      } catch (err) {
        console.error("Error fetching supplier details:", err);
        setError("Failed to fetch supplier details");
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [id]);

  const getScoreColor = (score) => {
    if (score === null || score === undefined) return "bg-gray-200";
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
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
      <div className="space-y-8 bg-neutral-50">
        <div className="px-4 py-6 bg-gradient-to-r from-emerald-700 to-teal-700 rounded-lg shadow-md text-white">
          <h1 className="text-3xl font-bold">Supplier Details</h1>
          <p className="mt-2 text-emerald-100">Loading supplier data...</p>
        </div>
        <div className="bg-white shadow-md rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 bg-neutral-50">
        <div className="px-4 py-6 bg-gradient-to-r from-emerald-700 to-teal-700 rounded-lg shadow-md text-white">
          <h1 className="text-3xl font-bold">Supplier Details</h1>
          <p className="mt-2 text-emerald-100">Error loading supplier</p>
        </div>
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
        <div className="mt-6">
          <Link
            to="/suppliers"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Suppliers
          </Link>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="space-y-8 bg-neutral-50">
        <div className="px-4 py-6 bg-gradient-to-r from-emerald-700 to-teal-700 rounded-lg shadow-md text-white">
          <h1 className="text-3xl font-bold">Supplier Details</h1>
          <p className="mt-2 text-emerald-100">Supplier not found</p>
        </div>
        <div className="rounded-md bg-yellow-50 p-4 border-l-4 border-yellow-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <InformationCircleIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Not Found</h3>
              <div className="mt-2 text-sm text-yellow-700">
                The supplier with ID {id} could not be found.
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Link
            to="/suppliers"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Suppliers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-neutral-50">
      <div className="px-4 py-6 bg-gradient-to-r from-emerald-700 to-teal-700 rounded-lg shadow-md text-white flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{supplier.name}</h1>
          <p className="mt-2 text-emerald-100">
            Detailed information and performance metrics
          </p>
        </div>
        <Link
          to="/suppliers"
          className="inline-flex items-center px-3 py-2 border border-emerald-300 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-500 transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Suppliers
        </Link>
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
                this time.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-lg">
        <div className="px-4 py-5 sm:px-6 flex items-center">
          <div className="flex-shrink-0 h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
            <UserGroupIcon className="h-10 w-10 text-primary-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-medium text-gray-900">
              {supplier.name}
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <GlobeAltIcon className="h-4 w-4 mr-1" />
              {supplier.country}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {supplier.id}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Ethical Score
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  {supplier.ethical_score !== null ? (
                    <>
                      <span
                        className={`flex-shrink-0 h-4 w-4 rounded-full ${getScoreColor(
                          supplier.ethical_score
                        )}`}
                      ></span>
                      <span className="ml-2 font-medium">
                        {supplier.ethical_score.toFixed(1)}%
                      </span>
                    </>
                  ) : (
                    "Not evaluated"
                  )}
                </div>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                CO₂ Emissions
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div>
                  <span>{supplier.co2_emissions.toFixed(1)} tons</span>
                  <div className="w-full mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
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
                </div>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Delivery Efficiency
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div>
                  <span>{supplier.delivery_efficiency.toFixed(2)}</span>
                  <div className="w-full mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={getMetricBarColor(
                        supplier.delivery_efficiency
                      )}
                      style={{
                        width: `${supplier.delivery_efficiency * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Wage Fairness
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div>
                  <span>{supplier.wage_fairness.toFixed(2)}</span>
                  <div className="w-full mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={getMetricBarColor(supplier.wage_fairness)}
                      style={{
                        width: `${supplier.wage_fairness * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Human Rights Index
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div>
                  <span>{supplier.human_rights_index.toFixed(2)}</span>
                  <div className="w-full mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={getMetricBarColor(supplier.human_rights_index)}
                      style={{
                        width: `${supplier.human_rights_index * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Waste Management Score
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div>
                  <span>{supplier.waste_management_score.toFixed(2)}</span>
                  <div className="w-full mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={getMetricBarColor(
                        supplier.waste_management_score
                      )}
                      style={{
                        width: `${supplier.waste_management_score * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(supplier.created_at).toLocaleString()}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Last Updated
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(supplier.updated_at).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <Link
          to={`/evaluate?id=${supplier.id}`}
          className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          Evaluate This Supplier
        </Link>
      </div>
    </div>
  );
};

export default SupplierDetails;
