import React from "react";
import "../styles/Credits.css";
import FadeInSection from "./FadeInSection";
import { Link } from "react-router-dom";

const Credits = () => {
  return (
    <FadeInSection>
      <div id="credits">
        <div className="ending-credits">
          <div>Built and designed by Guyo Halake.</div>
          <div style={{ marginTop: "6px" }}>
            All rights reserved. © {new Date().getFullYear()} ·{" "}
            <Link to="/admin" style={{ color: "var(--slate)", fontSize: "14px" }}>
              CMS Admin
            </Link>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
};

export default Credits;
