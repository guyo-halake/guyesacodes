import React from "react";
import Intro from "./components/Intro";
import Experience from "./components/Experience";
import About from "./components/About";
import Projects from "./components/Projects";
import HardwareProjects from "./components/HardwareProjects";
import Credits from "./components/Credits";
import NavBar from "./components/NavBar";
import SidebarNav from "./components/SidebarNav";
import AdminDashboard from "./components/admin/AdminDashboard";
import { PortfolioProvider, usePortfolio } from "./context/PortfolioContext";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import "./styles/Global.css";

// Main Page with dynamic section visibility from Admin CMS
function MainPortfolio() {
  const { sectionVisibility } = usePortfolio();

  return (
    <>
      <NavBar />
      <SidebarNav />
      <div id="content">
        {sectionVisibility.intro && <Intro />}
        {sectionVisibility.about && <About />}
        {sectionVisibility.experience && <Experience />}
        {sectionVisibility.projects && <Projects />}
        {sectionVisibility.hardware && <HardwareProjects />}
        <Credits />
      </div>
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
