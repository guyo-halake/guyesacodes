import React from "react";
import Intro from "./components/Intro";
import Experience from "./components/Experience";
import About from "./components/About";
import Projects from "./components/Projects";
import HardwareProjects from "./components/HardwareProjects";
// import ProjectLog from "./components/ProjectLog";
import Credits from "./components/Credits";
import NavBar from "./components/NavBar";
import SidebarNav from "./components/SidebarNav";
// import RobotGame from "./components/RobotGame";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import "./styles/Global.css";
// import "./styles/RobotGame.css";

function App() {
  const { pathname } = useLocation();
  // const [gameActive, setGameActive] = useState(false);
  // const [showGameInfo, setShowGameInfo] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="App">
      <NavBar />
      {/* Robot Game commented out to keep the portfolio clean and professional */}
      {/*
      <div className="game-toggle-fixed">
        <button
          className={`game-toggle-btn${gameActive ? " game-toggle-btn--on" : ""}`}
          onClick={() => setGameActive((a) => !a)}
        >
          <span className="game-toggle-dot" />
          game mode
        </button>
      </div>
      <RobotGame active={gameActive} />
      */}
      <SidebarNav />
      <div id="content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Intro />
                <About />
                <Experience />
                <Projects />
                <HardwareProjects />
                <Credits />
              </>
            }
          />
          {/* Hardware project log routes commented out */}
          {/* <Route path="/hardware/:projectId" element={<ProjectLog />} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
