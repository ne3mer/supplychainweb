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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-50">
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
