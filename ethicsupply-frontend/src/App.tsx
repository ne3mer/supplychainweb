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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-50">
        <NavigationBar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/evaluate" element={<EvaluateSupplier />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/suppliers" element={<SuppliersList />} />
            <Route path="/suppliers/:id" element={<SupplierDetails />} />
            <Route
              path="/suppliers/:id/scorecard"
              element={<SupplierScorecard />}
            />
            <Route path="/add-supplier" element={<AddSupplier />} />
            <Route
              path="/supplier-analytics/:id?"
              element={<SupplierAnalytics />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
