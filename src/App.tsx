import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Resident from "@/pages/Resident";
import Collector from "@/pages/Collector";
import Admin from "@/pages/Admin";
import Layout from "@/components/Layout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resident" element={<Layout><Resident /></Layout>} />
        <Route path="/collector" element={<Layout><Collector /></Layout>} />
        <Route path="/admin" element={<Layout><Admin /></Layout>} />
      </Routes>
    </Router>
  );
}
