import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import EvaluateSupplier from "./pages/EvaluateSupplier";
import Recommendations from "./pages/Recommendations";
import SuppliersList from "./pages/SuppliersList";
import SupplierDetails from "./pages/SupplierDetails";

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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
