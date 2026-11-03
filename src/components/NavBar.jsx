import React, { useState, useEffect, useRef } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { usePortfolio } from "../context/PortfolioContext";
import "../styles/NavBar.css";

const NavBar = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const { isEditMode, toggleEditMode } = usePortfolio();

  // Default theme is Light mode
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("portfolio_theme") || "light";
  });
  const scrollPos = useRef(0);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    if (expanded) {
      scrollPos.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPos.current}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
  }, [expanded]);

  const isAdminPage = location.pathname === "/admin";

  return (
    <Navbar
      fixed="top"
      expand="lg"
      className="navbar"
      data-bs-theme={theme === "light" ? "light" : "dark"}
      expanded={expanded}
      onToggle={(isExpanded) => setExpanded(isExpanded)}
    >
      <Container className="d-flex align-items-center justify-content-between">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" onSelect={() => setExpanded(false)}>
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link href="/#about">About</Nav.Link>
            <Nav.Link href="/#experience">Experience</Nav.Link>
            <Nav.Link href="/#projects">Projects</Nav.Link>
            <Nav.Link href="/#hardware-projects">Hardware</Nav.Link>

            {/* Admin link ONLY shows if user is explicitly on /admin */}
            {isAdminPage && (
              <Nav.Link as={Link} to="/" className="admin-nav-pill">
                Back to Site
              </Nav.Link>
            )}

            {/* In Edit Mode (activated from /admin), show quick exit */}
            {isEditMode && !isAdminPage && (
              <Nav.Link
                as="button"
                className="admin-nav-pill"
                onClick={() => {
                  toggleEditMode();
                  setExpanded(false);
                }}
                style={{ background: "transparent", border: "none", textAlign: "left", cursor: "pointer" }}
              >
                <TuneRoundedIcon sx={{ fontSize: 16, marginRight: "4px" }} />
                Exit Visual Editor
              </Nav.Link>
            )}
          </Nav>

          <Nav className="ms-auto align-items-center social-icons-nav" onSelect={() => setExpanded(false)}>
            <Nav.Link href="mailto:guyohalakeofficial@gmail.com" title="Email me">
              <EmailRoundedIcon style={{ fontSize: 20 }} />
            </Nav.Link>
            <Nav.Link href="https://github.com/guyo-halake" target="_blank" title="GitHub">
              <GitHubIcon style={{ fontSize: 19 }} />
            </Nav.Link>
            <Nav.Link
              href="https://www.linkedin.com/in/guyo-halake/"
              target="_blank"
              title="LinkedIn"
            >
              <LinkedInIcon style={{ fontSize: 21 }} />
            </Nav.Link>
            <Nav.Link href="https://medium.com/@guyo-halake" target="_blank" title="Medium">
              <BorderColorIcon style={{ fontSize: 20 }} />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>

        {/* ALWAYS-VISIBLE Controls: Theme Switcher (No public admin buttons) */}
        <div className="d-flex align-items-center gap-2">
          {isAdminPage && (
            <Link to="/" className="nav-admin-direct-btn" title="Back to site">
              <span className="nav-admin-label">Back to Site</span>
            </Link>
          )}

          {isEditMode && !isAdminPage && (
            <button
              type="button"
              className="nav-admin-direct-btn active-edit"
              onClick={toggleEditMode}
              title="Exit Visual Editor"
            >
              <TuneRoundedIcon sx={{ fontSize: 16 }} />
              <span className="nav-admin-label">Exit Editor</span>
            </button>
          )}

          <div className="theme-toggle-container">
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <>
                  <LightModeRoundedIcon sx={{ fontSize: 18 }} />
                  <span className="theme-toggle-label">Light</span>
                </>
              ) : (
                <>
                  <DarkModeRoundedIcon sx={{ fontSize: 18 }} />
                  <span className="theme-toggle-label">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default NavBar;
