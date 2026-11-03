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
import "../styles/NavBar.css";

const NavBar = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("portfolio_theme") || "dark";
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
            <Nav.Link as={Link} to="/admin" className="admin-nav-pill">
              <TuneRoundedIcon sx={{ fontSize: 16, marginRight: "4px" }} />
              Admin CMS
            </Nav.Link>
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

        {/* ALWAYS-VISIBLE Action Controls: Admin Button + Theme Switcher */}
        <div className="d-flex align-items-center gap-2">
          {!isAdminPage && (
            <Link to="/admin" className="nav-admin-direct-btn" title="Open Website Admin CMS">
              <TuneRoundedIcon sx={{ fontSize: 16 }} />
              <span className="nav-admin-label">Admin CMS</span>
            </Link>
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
