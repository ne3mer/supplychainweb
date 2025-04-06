import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import EvaluateSupplier from "./pages/EvaluateSupplier";
import Recommendations from "./pages/Recommendations";
import SuppliersList from "./pages/SuppliersList";
import SupplierDetails from "./pages/SupplierDetails";
import SupplierScorecard from "./pages/SupplierScorecard";
import AddSupplier from "./pages/AddSupplier";
import SupplierAnalytics from "./pages/SupplierAnalytics";
import SupplierAssessment from "./pages/enhanced/SupplierAssessment";
import GeoRiskMapping from "./pages/GeoRiskMapping";
import SupplyChainGraph from "./pages/SupplyChainGraph";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function App() {
  const [apiStatus, setApiStatus] = useState<string>("Checking...");
  const [apiStatusDetails, setApiStatusDetails] = useState<string>("");

  // Test the backend connection directly on mount
  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        // Normalize API URL to prevent double slashes
        const apiBaseUrl = import.meta.env.VITE_API_URL || "";
        const baseUrl = apiBaseUrl.endsWith("/api")
          ? apiBaseUrl.slice(0, -4) // Remove /api
          : apiBaseUrl.endsWith("/api/")
          ? apiBaseUrl.slice(0, -5) // Remove /api/
          : apiBaseUrl;

        // Remove trailing slash if present
        const normalizedBaseUrl = baseUrl.endsWith("/")
          ? baseUrl.slice(0, -1)
          : baseUrl;

        console.log("Testing connection to:", {
          apiUrl: apiBaseUrl,
          baseUrl: normalizedBaseUrl,
        });

        // Try the health endpoint first
        const healthResponse = await fetch(`${normalizedBaseUrl}/health/`, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-cache",
        });

        if (healthResponse.ok) {
          const data = await healthResponse.json();
          console.log("Health check successful:", data);
          setApiStatus("Connected");
          setApiStatusDetails(
            `Backend v${data.version} - Status: ${data.status}`
          );
          return;
        }

        // Ensure apiUrl has the correct format with /api/
        const apiUrl = normalizedBaseUrl + "/api";

        // Try the simple test endpoint next
        const simpleResponse = await fetch(`${apiUrl}/simple-test/`, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-cache",
        });

        if (simpleResponse.ok) {
          const data = await simpleResponse.json();
          console.log("API simple-test successful:", data);
          setApiStatus("Connected");
          setApiStatusDetails(`Simple test endpoint: ${data.status}`);
          return;
        }

        // Finally try the regular test endpoint
        const testResponse = await fetch(`${apiUrl}/test/`, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-cache",
        });

        if (testResponse.ok) {
          const data = await testResponse.json();
          console.log("API test successful:", data);
          setApiStatus("Connected");
          setApiStatusDetails(`Test endpoint: ${data.status}`);
          return;
        }

        setApiStatus("Failed");
        setApiStatusDetails(`All endpoints returned errors`);
      } catch (error) {
        console.error("Backend connection test failed:", error);
        setApiStatus("Failed");
        setApiStatusDetails(
          `Error: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    };

    testBackendConnection();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">
              <Link to="/">EthicSupply</Link>
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm px-3 py-1 rounded-full flex items-center gap-1">
                <span
                  className={`h-2 w-2 rounded-full ${
                    apiStatus === "Connected"
                      ? "bg-green-500"
                      : apiStatus === "Failed"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                ></span>
                <span>{apiStatus}</span>
                {apiStatusDetails && (
                  <span className="text-xs text-gray-500 ml-2">
                    {apiStatusDetails}
                  </span>
                )}
              </div>
              <Link
                to="/dashboard"
                className="text-indigo-600 hover:text-indigo-900"
              >
                Dashboard
              </Link>
              <Link
                to="/suppliers"
                className="text-indigo-600 hover:text-indigo-900"
              >
                Suppliers
              </Link>
            </div>
          </div>
        </header>
        <NavigationBar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/suppliers" element={<SuppliersList />} />
            <Route path="/supplier-details/:id" element={<SupplierDetails />} />
            <Route path="/evaluate-supplier" element={<EvaluateSupplier />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route
              path="/supplier-scorecard/:id?"
              element={<SupplierScorecard />}
            />
            <Route
              path="/supplier-analytics/:id?"
              element={<SupplierAnalytics />}
            />
            <Route path="/add-supplier" element={<AddSupplier />} />
            <Route
              path="/supplier-assessment"
              element={<SupplierAssessment />}
            />
            <Route path="/geo-risk-mapping" element={<GeoRiskMapping />} />
            <Route path="/supply-chain-graph" element={<SupplyChainGraph />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
