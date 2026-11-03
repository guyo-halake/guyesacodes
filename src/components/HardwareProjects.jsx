import React, { useState } from "react";
import "../styles/Projects.css";
import "../styles/HardwareProjects.css";
import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";
import FadeInSection from "./FadeInSection";
import { usePortfolio } from "../context/PortfolioContext";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

const HardwareProjects = () => {
  const {
    hardware,
    isEditMode,
    toggleHardwareVisibility,
    updateHardware,
    deleteHardware,
    addHardware,
  } = usePortfolio();

  const [expanded, setExpanded] = useState({});

  // In edit mode: show ALL hardware (with dimmed badge if hidden).
  // In visitor mode: show ONLY visible hardware.
  const displayHardware = isEditMode
    ? hardware
    : hardware.filter((h) => h.visible !== false);

  const toggleExpand = (idx) => {
    setExpanded((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  if (!displayHardware.length && !isEditMode) {
    return null;
  }

  return (
    <div id="hardware-projects">
      <FadeInSection>
        <div className="section-header">
          <span className="section-title">/ hardware</span>
        </div>

        <div className="projects-grid-3">
          {displayHardware.map((item, idx) => {
            const isExpanded = !!expanded[idx];
            const isHidden = item.visible === false;

            return (
              <FadeInSection key={item.id || idx} delay={(idx + 1) * 100 + "ms"}>
                <div
                  className={`project-grid-card ${isHidden ? "builder-card-dimmed" : ""}`}
                  style={{ position: "relative" }}
                >
                  {/* Visual Builder Action Overlay Buttons */}
                  {isEditMode && (
                    <div className="builder-card-controls">
                      <button
                        type="button"
                        className={`builder-ctrl-btn ${isHidden ? "btn-show" : "btn-hide"}`}
                        onClick={() => toggleHardwareVisibility(item.id)}
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
                          const newImg = window.prompt(
                            "Change hardware image URL/path:",
                            item.image || ""
                          );
                          if (newImg !== null) {
                            updateHardware(item.id, { image: newImg });
                          }
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
                          if (window.confirm(`Delete hardware "${item.title}"?`)) {
                            deleteHardware(item.id);
                          }
                        }}
                        title="Delete hardware card"
                      >
                        <DeleteRoundedIcon sx={{ fontSize: 15 }} />
                      </button>
                    </div>
                  )}

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

                  {/* Title & Subtitle (Inline Editable in Edit Mode) */}
                  <div className="project-card-heading">
                    <h3
                      className="project-card-title"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) =>
                        updateHardware(item.id, { title: e.currentTarget.textContent })
                      }
                      title={isEditMode ? "Click to edit title" : undefined}
                    >
                      {item.title}
                    </h3>
                    <div
                      className="project-card-subtitle"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) =>
                        updateHardware(item.id, { subtitle: e.currentTarget.textContent })
                      }
                      title={isEditMode ? "Click to edit subtitle" : undefined}
                    >
                      {item.subtitle}
                    </div>
                  </div>

                  {/* Body Content (Inline Editable in Edit Mode) */}
                  <div className="project-card-body">
                    <p
                      className="project-lead-text"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) =>
                        updateHardware(item.id, { lead: e.currentTarget.textContent })
                      }
                      title={isEditMode ? "Click to edit summary text" : undefined}
                    >
                      {item.lead}
                    </p>

                    {isExpanded && item.more && (
                      <div className="project-expanded-text">
                        {item.more.map((paragraph, pIdx) => (
                          <p
                            key={pIdx}
                            contentEditable={isEditMode}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => {
                              const newMore = [...item.more];
                              newMore[pIdx] = e.currentTarget.textContent;
                              updateHardware(item.id, { more: newMore });
                            }}
                          >
                            {paragraph}
                          </p>
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
                    <div
                      className="project-card-tech"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => {
                        const raw = e.currentTarget.textContent || "";
                        const parsed = raw
                          .split(/·|,/)
                          .map((t) => t.trim())
                          .filter(Boolean);
                        updateHardware(item.id, { techStack: parsed });
                      }}
                      title={isEditMode ? "Click to edit specs (separate by · or comma)" : undefined}
                    >
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

          {/* In Edit Mode: "+ Add New Hardware" placeholder card */}
          {isEditMode && (
            <div
              className="add-new-card-placeholder"
              onClick={() => {
                const title = window.prompt(
                  "New Hardware / Workstation Name:",
                  "High-Density Compute Node"
                );
                if (!title) return;
                const lead = window.prompt(
                  "Hardware overview/specs:",
                  "Custom liquid-cooled virtualization server with 64GB ECC RAM..."
                );
                addHardware({ title, lead });
              }}
            >
              <AddRoundedIcon sx={{ fontSize: 42, color: "var(--green-bright)" }} />
              <span>Add New Hardware Card</span>
            </div>
          )}
        </div>
      </FadeInSection>
    </div>
  );
};

export default HardwareProjects;
