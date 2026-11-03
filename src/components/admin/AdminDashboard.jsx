import React, { useState } from "react";
import "../../styles/admin/AdminDashboard.css";
import { usePortfolio } from "../../context/PortfolioContext";
import { Link } from "react-router-dom";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import CloudDownloadRoundedIcon from "@mui/icons-material/CloudDownloadRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

const AdminDashboard = () => {
  const {
    profile,
    sectionVisibility,
    projects,
    hardware,
    updateProfile,
    toggleSection,
    toggleProjectVisibility,
    saveProject,
    deleteProject,
    toggleHardwareVisibility,
    saveHardware,
    deleteHardware,
    resetToDefaults,
    exportDataJSON,
    importDataJSON,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState("sections"); // "sections" | "projects" | "hardware" | "profile" | "sync"
  const [editingProject, setEditingProject] = useState(null);
  const [editingHardware, setEditingHardware] = useState(null);
  const [notification, setNotification] = useState("");
  const [importText, setImportText] = useState("");

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  // Profile Form state
  const [profileForm, setProfileForm] = useState(profile);
  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    showNotification("Profile details saved successfully!");
  };

  // Project Form Submit
  const handleProjectSubmit = (e) => {
    e.preventDefault();
    saveProject(editingProject);
    setEditingProject(null);
    showNotification(`Project "${editingProject.title}" saved!`);
  };

  // Hardware Form Submit
  const handleHardwareSubmit = (e) => {
    e.preventDefault();
    saveHardware(editingHardware);
    setEditingHardware(null);
    showNotification(`Hardware "${editingHardware.title}" saved!`);
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-left">
          <Link to="/" className="admin-back-btn">
            <ArrowBackRoundedIcon sx={{ fontSize: 18 }} />
            <span>View Live Site</span>
          </Link>
          <h1 className="admin-title">Guyo Halake · Portfolio CMS</h1>
          <span className="admin-badge">v2 Admin</span>
        </div>

        <div className="admin-header-actions">
          {notification && (
            <div className="admin-notification">
              <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />
              <span>{notification}</span>
            </div>
          )}
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="admin-nav-tabs">
        <button
          className={`admin-tab-btn ${activeTab === "sections" ? "active" : ""}`}
          onClick={() => setActiveTab("sections")}
        >
          Section Visibility
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "projects" ? "active" : ""}`}
          onClick={() => setActiveTab("projects")}
        >
          Projects ({projects.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "hardware" ? "active" : ""}`}
          onClick={() => setActiveTab("hardware")}
        >
          Hardware ({hardware.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile & Text
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "sync" ? "active" : ""}`}
          onClick={() => setActiveTab("sync")}
        >
          Backup & Sync
        </button>
      </nav>

      {/* TAB 1: Section Visibility */}
      {activeTab === "sections" && (
        <section className="admin-panel">
          <div className="panel-heading">
            <h2>Show or Hide Website Sections</h2>
            <p>Toggle whole sections on and off in real time without touching code.</p>
          </div>

          <div className="sections-grid">
            {Object.keys(sectionVisibility).map((key) => {
              const isVisible = sectionVisibility[key];
              return (
                <div key={key} className={`section-card ${isVisible ? "active" : "disabled"}`}>
                  <div className="section-info">
                    <span className="section-name">/{key}</span>
                    <span className="section-status">
                      {isVisible ? "Currently Visible on Site" : "Hidden from Public"}
                    </span>
                  </div>
                  <button
                    className={`toggle-switch-btn ${isVisible ? "on" : "off"}`}
                    onClick={() => {
                      toggleSection(key);
                      showNotification(`Section /${key} is now ${!isVisible ? "visible" : "hidden"}`);
                    }}
                  >
                    {isVisible ? (
                      <>
                        <VisibilityRoundedIcon sx={{ fontSize: 18 }} />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 2: Projects Management */}
      {activeTab === "projects" && (
        <section className="admin-panel">
          <div className="panel-heading d-flex justify-content-between align-items-center">
            <div>
              <h2>Projects Management</h2>
              <p>Add new projects, show or hide existing ones, or edit descriptions and links.</p>
            </div>
            <button
              className="admin-primary-btn"
              onClick={() =>
                setEditingProject({
                  id: "proj-" + Date.now(),
                  title: "",
                  subtitle: "",
                  image: "/assets/truth.png",
                  visible: true,
                  lead: "",
                  more: [""],
                  techStack: [],
                  link: "https://github.com/guyo-halake",
                })
              }
            >
              <AddRoundedIcon sx={{ fontSize: 20 }} />
              <span>Add New Project</span>
            </button>
          </div>

          {/* Modal / Form when editing */}
          {editingProject && (
            <div className="admin-editor-overlay">
              <div className="admin-editor-modal">
                <div className="editor-modal-header">
                  <h3>{editingProject.id.startsWith("proj-") ? "Add New Project" : "Edit Project"}</h3>
                  <button className="editor-close-btn" onClick={() => setEditingProject(null)}>
                    ✕
                  </button>
                </div>

                <form onSubmit={handleProjectSubmit} className="editor-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Project Title *</label>
                      <input
                        type="text"
                        required
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        placeholder="e.g. Odin Bot"
                      />
                    </div>
                    <div className="form-group">
                      <label>Subtitle / Category</label>
                      <input
                        type="text"
                        value={editingProject.subtitle}
                        onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                        placeholder="e.g. Personal Telegram Agent"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Preview Image Path or URL</label>
                      <input
                        type="text"
                        value={editingProject.image}
                        onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                        placeholder="/assets/truth.png or https://..."
                      />
                    </div>
                    <div className="form-group">
                      <label>GitHub / Live Link</label>
                      <input
                        type="text"
                        value={editingProject.link}
                        onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                        placeholder="https://github.com/guyo-halake/..."
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Lead Paragraph (Short description shown initially) *</label>
                    <textarea
                      rows={3}
                      required
                      value={editingProject.lead}
                      onChange={(e) => setEditingProject({ ...editingProject, lead: e.target.value })}
                      placeholder="Brief punchy summary of what the project does..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Deep Dive Details (Shown when 'Show more' is clicked)</label>
                    <textarea
                      rows={4}
                      value={editingProject.more ? editingProject.more.join("\n\n") : ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          more: e.target.value.split("\n\n").filter(Boolean),
                        })
                      }
                      placeholder="Separate paragraphs with a blank line..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Tech Stack Tags (Comma-separated)</label>
                    <input
                      type="text"
                      value={editingProject.techStack ? editingProject.techStack.join(", ") : ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          techStack: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      placeholder="Python, Google Gemini API, MCP, Telegram Bot API"
                    />
                  </div>

                  <div className="editor-modal-actions">
                    <button type="button" className="admin-cancel-btn" onClick={() => setEditingProject(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="admin-save-btn">
                      Save Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* List of Projects */}
          <div className="items-list">
            {projects.map((proj) => (
              <div key={proj.id} className={`item-row ${proj.visible ? "visible" : "hidden"}`}>
                <div className="item-thumb">
                  <img src={proj.image} alt={proj.title} />
                </div>
                <div className="item-meta">
                  <div className="d-flex align-items-center gap-2">
                    <h4 className="item-title">{proj.title}</h4>
                    <span className="item-sub">{proj.subtitle}</span>
                  </div>
                  <p className="item-excerpt">{proj.lead}</p>
                  <div className="item-tags">
                    {proj.techStack?.slice(0, 5).map((t, i) => (
                      <span key={i} className="mini-tag">
                        {t}
                      </span>
                    ))}
                    {proj.techStack?.length > 5 && <span className="mini-tag">+{proj.techStack.length - 5}</span>}
                  </div>
                </div>

                <div className="item-controls">
                  <button
                    className={`icon-action-btn ${proj.visible ? "visible-btn" : "hidden-btn"}`}
                    title={proj.visible ? "Hide from public" : "Make visible"}
                    onClick={() => {
                      toggleProjectVisibility(proj.id);
                      showNotification(`"${proj.title}" is now ${!proj.visible ? "visible" : "hidden"}`);
                    }}
                  >
                    {proj.visible ? <VisibilityRoundedIcon sx={{ fontSize: 18 }} /> : <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} />}
                  </button>
                  <button
                    className="icon-action-btn edit-btn"
                    title="Edit project"
                    onClick={() => setEditingProject(proj)}
                  >
                    <EditRoundedIcon sx={{ fontSize: 18 }} />
                  </button>
                  <button
                    className="icon-action-btn delete-btn"
                    title="Delete project"
                    onClick={() => {
                      if (window.confirm(`Delete project "${proj.title}"?`)) {
                        deleteProject(proj.id);
                        showNotification(`Deleted "${proj.title}"`);
                      }
                    }}
                  >
                    <DeleteRoundedIcon sx={{ fontSize: 18 }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: Hardware Management */}
      {activeTab === "hardware" && (
        <section className="admin-panel">
          <div className="panel-heading d-flex justify-content-between align-items-center">
            <div>
              <h2>Hardware Rigs & IoT Management</h2>
              <p>Add new machines, change specs, or hide hardware cards.</p>
            </div>
            <button
              className="admin-primary-btn"
              onClick={() =>
                setEditingHardware({
                  id: "hw-" + Date.now(),
                  title: "",
                  subtitle: "",
                  image: "/assets/hardware/pc/images/header.png",
                  visible: true,
                  lead: "",
                  more: [""],
                  techStack: [],
                })
              }
            >
              <AddRoundedIcon sx={{ fontSize: 20 }} />
              <span>Add New Hardware</span>
            </button>
          </div>

          {/* Modal / Form when editing hardware */}
          {editingHardware && (
            <div className="admin-editor-overlay">
              <div className="admin-editor-modal">
                <div className="editor-modal-header">
                  <h3>{editingHardware.id.startsWith("hw-") ? "Add New Hardware" : "Edit Hardware"}</h3>
                  <button className="editor-close-btn" onClick={() => setEditingHardware(null)}>
                    ✕
                  </button>
                </div>

                <form onSubmit={handleHardwareSubmit} className="editor-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Hardware Name *</label>
                      <input
                        type="text"
                        required
                        value={editingHardware.title}
                        onChange={(e) => setEditingHardware({ ...editingHardware, title: e.target.value })}
                        placeholder="e.g. Bare Metal Linux Home Lab"
                      />
                    </div>
                    <div className="form-group">
                      <label>Subtitle / Purpose</label>
                      <input
                        type="text"
                        value={editingHardware.subtitle}
                        onChange={(e) => setEditingHardware({ ...editingHardware, subtitle: e.target.value })}
                        placeholder="e.g. 24/7 Server · Infrastructure"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Image Path or URL</label>
                    <input
                      type="text"
                      value={editingHardware.image}
                      onChange={(e) => setEditingHardware({ ...editingHardware, image: e.target.value })}
                      placeholder="/assets/hardware/pc/images/cover.png or https://..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Lead Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={editingHardware.lead}
                      onChange={(e) => setEditingHardware({ ...editingHardware, lead: e.target.value })}
                      placeholder="Summary of hardware and deployment..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Specifications / Deep Dive Points (Separate by line)</label>
                    <textarea
                      rows={4}
                      value={editingHardware.more ? editingHardware.more.join("\n") : ""}
                      onChange={(e) =>
                        setEditingHardware({
                          ...editingHardware,
                          more: e.target.value.split("\n").filter(Boolean),
                        })
                      }
                      placeholder="One spec/detail per line..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Hardware Specs Tags (Comma-separated)</label>
                    <input
                      type="text"
                      value={editingHardware.techStack ? editingHardware.techStack.join(", ") : ""}
                      onChange={(e) =>
                        setEditingHardware({
                          ...editingHardware,
                          techStack: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      placeholder="AMD Ryzen 5700, 16 GB RAM, 1 TB SSD, Ubuntu"
                    />
                  </div>

                  <div className="editor-modal-actions">
                    <button type="button" className="admin-cancel-btn" onClick={() => setEditingHardware(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="admin-save-btn">
                      Save Hardware
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* List of Hardware */}
          <div className="items-list">
            {hardware.map((hw) => (
              <div key={hw.id} className={`item-row ${hw.visible ? "visible" : "hidden"}`}>
                <div className="item-thumb">
                  <img src={hw.image} alt={hw.title} />
                </div>
                <div className="item-meta">
                  <div className="d-flex align-items-center gap-2">
                    <h4 className="item-title">{hw.title}</h4>
                    <span className="item-sub">{hw.subtitle}</span>
                  </div>
                  <p className="item-excerpt">{hw.lead}</p>
                  <div className="item-tags">
                    {hw.techStack?.map((t, i) => (
                      <span key={i} className="mini-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="item-controls">
                  <button
                    className={`icon-action-btn ${hw.visible ? "visible-btn" : "hidden-btn"}`}
                    title={hw.visible ? "Hide from public" : "Make visible"}
                    onClick={() => {
                      toggleHardwareVisibility(hw.id);
                      showNotification(`"${hw.title}" is now ${!hw.visible ? "visible" : "hidden"}`);
                    }}
                  >
                    {hw.visible ? <VisibilityRoundedIcon sx={{ fontSize: 18 }} /> : <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} />}
                  </button>
                  <button
                    className="icon-action-btn edit-btn"
                    title="Edit hardware"
                    onClick={() => setEditingHardware(hw)}
                  >
                    <EditRoundedIcon sx={{ fontSize: 18 }} />
                  </button>
                  <button
                    className="icon-action-btn delete-btn"
                    title="Delete hardware"
                    onClick={() => {
                      if (window.confirm(`Delete hardware "${hw.title}"?`)) {
                        deleteHardware(hw.id);
                        showNotification(`Deleted "${hw.title}"`);
                      }
                    }}
                  >
                    <DeleteRoundedIcon sx={{ fontSize: 18 }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 4: Profile & Bio Editor */}
      {activeTab === "profile" && (
        <section className="admin-panel">
          <div className="panel-heading">
            <h2>Profile, Bio & Social Links</h2>
            <p>Update your headline, about narrative, or avatar image path without touching code.</p>
          </div>

          <form onSubmit={handleProfileSave} className="admin-profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>Intro Greeting</label>
                <input
                  type="text"
                  value={profileForm.greeting}
                  onChange={(e) => setProfileForm({ ...profileForm, greeting: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Avatar / Photo Path</label>
                <input
                  type="text"
                  value={profileForm.avatarImage}
                  onChange={(e) => setProfileForm({ ...profileForm, avatarImage: e.target.value })}
                  placeholder="/assets/me2.jpg"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Hero Intro Pitch</label>
              <textarea
                rows={3}
                value={profileForm.introDesc}
                onChange={(e) => setProfileForm({ ...profileForm, introDesc: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>About Paragraph 1</label>
              <textarea
                rows={3}
                value={profileForm.aboutParagraphOne}
                onChange={(e) => setProfileForm({ ...profileForm, aboutParagraphOne: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>About Paragraph 2</label>
              <textarea
                rows={3}
                value={profileForm.aboutParagraphTwo}
                onChange={(e) => setProfileForm({ ...profileForm, aboutParagraphTwo: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>GitHub Profile Link</label>
                <input
                  type="url"
                  value={profileForm.github}
                  onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>LinkedIn Profile Link</label>
                <input
                  type="url"
                  value={profileForm.linkedin}
                  onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Medium Profile Link</label>
                <input
                  type="url"
                  value={profileForm.medium}
                  onChange={(e) => setProfileForm({ ...profileForm, medium: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="admin-save-btn">
              Save Profile Changes
            </button>
          </form>
        </section>
      )}

      {/* TAB 5: Backup & JSON Sync */}
      {activeTab === "sync" && (
        <section className="admin-panel">
          <div className="panel-heading">
            <h2>Backup, Export & Sync</h2>
            <p>Download your complete website configuration as a JSON file or restore from a backup.</p>
          </div>

          <div className="sync-actions-grid">
            <div className="sync-card">
              <h3>Export Backup</h3>
              <p>Download all current projects, hardware specs, visibility toggles, and bio texts into a single JSON file.</p>
              <button
                className="admin-primary-btn"
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportDataJSON());
                  const downloadAnchor = document.createElement("a");
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `guyo_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                  showNotification("Backup downloaded successfully!");
                }}
              >
                <CloudDownloadRoundedIcon sx={{ fontSize: 18 }} />
                <span>Download Backup (.json)</span>
              </button>
            </div>

            <div className="sync-card">
              <h3>Reset Defaults</h3>
              <p>Revert all changes and restore original built-in projects and hardware settings.</p>
              <button
                className="admin-cancel-btn"
                onClick={() => {
                  if (window.confirm("Are you sure you want to revert all changes back to initial defaults?")) {
                    resetToDefaults();
                    showNotification("Reset to initial defaults completed!");
                  }
                }}
              >
                <RestartAltRoundedIcon sx={{ fontSize: 18 }} />
                <span>Reset All to Defaults</span>
              </button>
            </div>
          </div>

          <div className="import-box mt-4">
            <h3>Restore from JSON Text</h3>
            <textarea
              rows={5}
              placeholder="Paste exported portfolio JSON here..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
            <button
              className="admin-primary-btn mt-2"
              onClick={() => {
                if (!importText.trim()) return;
                const res = importDataJSON(importText);
                if (res.success) {
                  showNotification("Configuration imported successfully!");
                  setImportText("");
                } else {
                  alert("Invalid JSON: " + res.error);
                }
              }}
            >
              <CloudUploadRoundedIcon sx={{ fontSize: 18 }} />
              <span>Apply Imported Configuration</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;

