import React, { useEffect } from "react";
import Intro from "./components/Intro";
import Experience from "./components/Experience";
import About from "./components/About";
import Projects from "./components/Projects";
import HardwareProjects from "./components/HardwareProjects";
import Credits from "./components/Credits";
import NavBar from "./components/NavBar";
import SidebarNav from "./components/SidebarNav";
import LiveVisualToolbar from "./components/admin/LiveVisualToolbar";
import AdminDashboard from "./components/admin/AdminDashboard";
import { PortfolioProvider, usePortfolio } from "./context/PortfolioContext";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import "./styles/Global.css";

// Main Page with dynamic section visibility from Admin CMS + Live Visual Toolbar
function MainPortfolio() {
  const { sectionVisibility } = usePortfolio();

  return (
    <>
      <NavBar />
      <SidebarNav />
      <div id="content">
        {sectionVisibility?.intro !== false && <Intro />}
        {sectionVisibility?.about !== false && <About />}
        {sectionVisibility?.experience !== false && <Experience />}
        {sectionVisibility?.projects !== false && <Projects />}
        {sectionVisibility?.hardware !== false && <HardwareProjects />}
        <Credits />
      </div>
      {/* Floating in-page Visual Builder Dock */}
      <LiveVisualToolbar />
    </>
  );
}

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <PortfolioProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPortfolio />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </PortfolioProvider>
  );
}

export default App;
