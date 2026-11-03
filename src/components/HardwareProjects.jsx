import React, { useState } from "react";
import "../styles/Projects.css";
import "../styles/HardwareProjects.css";
import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";
import FadeInSection from "./FadeInSection";
import { usePortfolio } from "../context/PortfolioContext";

const HardwareProjects = () => {
  const { hardware } = usePortfolio();
  const [expanded, setExpanded] = useState({});

  // Filter only visible hardware items configured via Admin CMS
  const visibleHardware = hardware.filter((h) => h.visible !== false);

  const toggleExpand = (idx) => {
    setExpanded((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  if (!visibleHardware.length) {
    return null;
  }

  return (
    <div id="hardware-projects">
      <FadeInSection>
        <div className="section-header">
          <span className="section-title">/ hardware</span>
        </div>

        <div className="projects-grid-3">
          {visibleHardware.map((item, idx) => {
            const isExpanded = !!expanded[idx];
            return (
              <FadeInSection key={item.id || idx} delay={(idx + 1) * 100 + "ms"}>
                <div className="project-grid-card">
                  {/* Card Header */}
                  <div className="project-card-top">
                    <div className="project-folder-icon">
                      <MemoryRoundedIcon sx={{ fontSize: 32, color: "var(--green-bright)" }} />
                    </div>
                  </div>

                  {/* Image */}
                  {item.image && (
                    <div className="project-card-image-box">
                      <img src={item.image} alt={item.title} />
                    </div>
                  )}

                  {/* Title & Subtitle */}
                  <div className="project-card-heading">
                    <h3 className="project-card-title">{item.title}</h3>
                    <div className="project-card-subtitle">{item.subtitle}</div>
                  </div>

                  {/* Body Content */}
                  <div className="project-card-body">
                    <p className="project-lead-text">{item.lead}</p>

                    {isExpanded && item.more && (
                      <div className="project-expanded-text">
                        {item.more.map((paragraph, pIdx) => (
                          <p key={pIdx}>{paragraph}</p>
                        ))}
                      </div>
                    )}

                    {item.more && item.more.length > 0 && (
                      <button
                        type="button"
                        className="project-toggle-btn"
                        onClick={() => toggleExpand(idx)}
                      >
                        {isExpanded ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>

                  {/* Tech / Specs at bottom */}
                  {item.techStack && item.techStack.length > 0 && (
                    <div className="project-card-tech">
                      {item.techStack.map((tech, tIdx) => (
                        <span key={tIdx} className="tech-pill">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </FadeInSection>
            );
          })}
        </div>
      </FadeInSection>
    </div>
  );
};

export default HardwareProjects;
