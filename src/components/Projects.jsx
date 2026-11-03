import React, { useState } from "react";
import "../styles/Projects.css";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import FadeInSection from "./FadeInSection";
import ExternalLinks from "./ExternalLinks";
import { usePortfolio } from "../context/PortfolioContext";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

const Projects = () => {
  const {
    projects,
    isEditMode,
    toggleProjectVisibility,
    updateProject,
    deleteProject,
    addProject,
  } = usePortfolio();

  const [expanded, setExpanded] = useState({});

  // In edit mode: show ALL projects (with dimmed badge if hidden).
  // In visitor mode: show ONLY visible projects.
  const displayProjects = isEditMode
    ? projects
    : projects.filter((p) => p.visible !== false);

  const toggleExpand = (idx) => {
    setExpanded((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

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
          {displayProjects.map((proj, idx) => {
            const isExpanded = !!expanded[idx];
            const isHidden = proj.visible === false;

            return (
              <FadeInSection key={proj.id || idx} delay={(idx + 1) * 100 + "ms"}>
                <div className={`project-grid-card ${isHidden ? "builder-card-dimmed" : ""}`} style={{ position: "relative" }}>
                  {/* Visual Builder Action Overlay Buttons */}
                  {isEditMode && (
                    <div className="builder-card-controls">
                      <button
                        type="button"
                        className={`builder-ctrl-btn ${isHidden ? "btn-show" : "btn-hide"}`}
                        onClick={() => toggleProjectVisibility(proj.id)}
                        title={isHidden ? "Show on public site" : "Hide from public"}
                      >
                        {isHidden ? (
                          <>
                            <VisibilityRoundedIcon sx={{ fontSize: 16 }} />
                            <span>Show</span>
                          </>
                        ) : (
                          <>
                            <VisibilityOffRoundedIcon sx={{ fontSize: 16 }} />
                            <span>Hide</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="builder-ctrl-btn"
                        onClick={() => {
                          const newImg = window.prompt("Change project image URL/path:", proj.image || "");
                          if (newImg !== null) updateProject(proj.id, { image: newImg });
                        }}
                        title="Change image"
                      >
                        <EditRoundedIcon sx={{ fontSize: 15 }} />
                        <span>Image</span>
                      </button>

                      <button
                        type="button"
                        className="builder-ctrl-btn"
                        style={{ color: "#ef4444" }}
                        onClick={() => {
                          if (window.confirm(`Delete project "${proj.title}"?`)) {
                            deleteProject(proj.id);
                          }
                        }}
                        title="Delete project"
                      >
                        <DeleteRoundedIcon sx={{ fontSize: 15 }} />
                      </button>
                    </div>
                  )}

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

                  {/* Title & Subtitle (Inline Editable in Edit Mode) */}
                  <div className="project-card-heading">
                    <h3
                      className="project-card-title"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => updateProject(proj.id, { title: e.currentTarget.textContent })}
                      title={isEditMode ? "Click to edit project title" : undefined}
                    >
                      {proj.title}
                    </h3>
                    <div
                      className="project-card-subtitle"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => updateProject(proj.id, { subtitle: e.currentTarget.textContent })}
                      title={isEditMode ? "Click to edit subtitle" : undefined}
                    >
                      {proj.subtitle}
                    </div>
                  </div>

                  {/* Body Content (Inline Editable in Edit Mode) */}
                  <div className="project-card-body">
                    <p
                      className="project-lead-text"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => updateProject(proj.id, { lead: e.currentTarget.textContent })}
                      title={isEditMode ? "Click to edit summary text" : undefined}
                    >
                      {proj.lead}
                    </p>

                    {isExpanded && proj.more && (
                      <div className="project-expanded-text">
                        {proj.more.map((paragraph, pIdx) => (
                          <p
                            key={pIdx}
                            contentEditable={isEditMode}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => {
                              const newMore = [...proj.more];
                              newMore[pIdx] = e.currentTarget.textContent;
                              updateProject(proj.id, { more: newMore });
                            }}
                          >
                            {paragraph}
                          </p>
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
                    <div
                      className="project-card-tech"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => {
                        const raw = e.currentTarget.textContent || "";
                        const parsed = raw.split(/·|,/).map((t) => t.trim()).filter(Boolean);
                        updateProject(proj.id, { techStack: parsed });
                      }}
                      title={isEditMode ? "Click to edit tags (separate by · or comma)" : undefined}
                    >
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

          {/* In Edit Mode: "+ Add New Project" placeholder card right in the grid */}
          {isEditMode && (
            <div
              className="add-new-card-placeholder"
              onClick={() => {
                const title = window.prompt("New Project Title:", "Autonomous Workflow Engine");
                if (!title) return;
                const lead = window.prompt("Project summary/description:", "Built a multi-agent system...");
                addProject({ title, lead });
              }}
            >
              <AddRoundedIcon sx={{ fontSize: 42, color: "var(--green-bright)" }} />
              <span>Add New Project Card</span>
            </div>
          )}
        </div>
      </FadeInSection>
    </div>
  );
};

export default Projects;
