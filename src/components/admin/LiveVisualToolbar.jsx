import React, { useState } from "react";
import "../../styles/admin/LiveVisualToolbar.css";
import { usePortfolio } from "../../context/PortfolioContext";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const LiveVisualToolbar = () => {
  const {
    isEditMode,
    toggleEditMode,
    sectionVisibility,
    toggleSection,
    saveAllChanges,
    resetAllToDefaults,
  } = usePortfolio();

  const [savedBadge, setSavedBadge] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleSave = () => {
    saveAllChanges();
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 2500);
  };

  // Only render when isEditMode is active (accessed via /admin)
  if (!isEditMode) {
    return null;
  }

  return (
    <aside className="live-builder-dock mode-active" aria-label="Visual Builder Dock">
      <div className={`builder-active-bar ${collapsed ? "bar-collapsed" : ""}`}>
          <div className="builder-bar-header">
            <div className="builder-title-badge">
              <span className="builder-pulse-dot" />
              <strong>Live Visual Builder</strong>
            </div>

            <div className="builder-header-btns">
              <button
                type="button"
                className="builder-icon-btn"
                title={collapsed ? "Expand toolbar" : "Minimize toolbar"}
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed ? "▲" : "▼"}
              </button>
              <button
                type="button"
                className="builder-exit-btn"
                onClick={toggleEditMode}
                title="Exit Builder Mode"
              >
                <CloseRoundedIcon sx={{ fontSize: 16 }} />
                <span>Exit</span>
              </button>
            </div>
          </div>

          {!collapsed && (
            <div className="builder-bar-content">
              {/* Section Visibility Switches */}
              <div className="builder-sections-row">
                <span className="builder-row-label">Sections:</span>
                <div className="builder-chips-group">
                  {Object.keys(sectionVisibility).map((key) => {
                    const isVisible = sectionVisibility[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        className={`section-chip ${isVisible ? "chip-visible" : "chip-hidden"}`}
                        onClick={() => toggleSection(key)}
                        title={`Click to ${isVisible ? "hide" : "show"} /${key}`}
                      >
                        {isVisible ? (
                          <VisibilityRoundedIcon sx={{ fontSize: 14 }} />
                        ) : (
                          <VisibilityOffRoundedIcon sx={{ fontSize: 14 }} />
                        )}
                        <span>/{key}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="builder-actions-row">
                <div className="builder-tips">
                  💡 <em>Click any text, card, or tag to edit directly in real time.</em>
                </div>

                <div className="builder-action-btns">
                  <button
                    type="button"
                    className="builder-reset-btn"
                    onClick={() => {
                      if (window.confirm("Revert all text & cards back to original code defaults?")) {
                        resetAllToDefaults();
                      }
                    }}
                  >
                    <RestartAltRoundedIcon sx={{ fontSize: 16 }} />
                    <span>Reset</span>
                  </button>

                  <button
                    type="button"
                    className={`builder-save-btn ${savedBadge ? "saved-success" : ""}`}
                    onClick={handleSave}
                  >
                    <CheckRoundedIcon sx={{ fontSize: 18 }} />
                    <span>{savedBadge ? "Saved!" : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
    </aside>
  );
};

export default LiveVisualToolbar;

