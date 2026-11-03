import React, { useState } from "react";
import "../styles/Projects.css";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import FadeInSection from "./FadeInSection";
import ExternalLinks from "./ExternalLinks";
import { usePortfolio } from "../context/PortfolioContext";

const Projects = () => {
  const { projects } = usePortfolio();
  const [expanded, setExpanded] = useState({});

  // Filter only visible projects configured via Admin CMS
  const visibleProjects = projects.filter((p) => p.visible !== false);

  const toggleExpand = (idx) => {
    setExpanded((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  if (!visibleProjects.length) {
    return null;
  }

  return (
    <div id="projects">
      <FadeInSection>
        <div className="section-header">
          <span className="section-title">/ projects</span>
          <a
            href="https://github.com/guyo-halake"
            className="explore-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            View all on GitHub
          </a>
        </div>

        {/* 3-Card Horizontal Grid */}
        <div className="projects-grid-3">
          {visibleProjects.map((proj, idx) => {
            const isExpanded = !!expanded[idx];
            return (
              <FadeInSection key={proj.id || idx} delay={(idx + 1) * 100 + "ms"}>
                <div className="project-grid-card">
                  {/* Card Header */}
                  <div className="project-card-top">
                    <div className="project-folder-icon">
                      <FolderOpenRoundedIcon sx={{ fontSize: 32 }} />
                    </div>
                    {proj.link && <ExternalLinks githubLink={proj.link} />}
                  </div>

                  {/* Embedded Project Image */}
                  {proj.image && (
                    <div className="project-card-image-box">
                      <img src={proj.image} alt={proj.title} />
                    </div>
                  )}

                  {/* Title & Subtitle */}
                  <div className="project-card-heading">
                    <h3 className="project-card-title">
                      {proj.link ? (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {proj.title}
                        </a>
                      ) : (
                        <span>{proj.title}</span>
                      )}
                    </h3>
                    {proj.subtitle && (
                      <div className="project-card-subtitle">
                        {proj.subtitle}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="project-card-body">
                    <p className="project-lead-text">{proj.lead}</p>

                    {isExpanded && proj.more && (
                      <div className="project-expanded-text">
                        {proj.more.map((paragraph, pIdx) => (
                          <p key={pIdx}>{paragraph}</p>
                        ))}
                      </div>
                    )}

                    {proj.more && proj.more.length > 0 && (
                      <button
                        type="button"
                        className="project-toggle-btn"
                        onClick={() => toggleExpand(idx)}
                      >
                        {isExpanded ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>

                  {/* Tech Stack Tags at bottom */}
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="project-card-tech">
                      {proj.techStack.map((tech, tIdx) => (
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

export default Projects;
