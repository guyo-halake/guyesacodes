import React, { createContext, useContext, useState, useEffect } from "react";
import { initialPortfolioData } from "../data/portfolioData";

const PortfolioContext = createContext(null);
const STORAGE_KEY = "guyohalake_portfolio_v2_photos_v6";

export const PortfolioProvider = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          profile: { ...initialPortfolioData.profile, ...parsed.profile },
          sectionVisibility: { ...initialPortfolioData.sectionVisibility, ...parsed.sectionVisibility },
          projects: parsed.projects && parsed.projects.length ? parsed.projects : initialPortfolioData.projects,
          hardware: parsed.hardware && parsed.hardware.length ? parsed.hardware : initialPortfolioData.hardware,
        };
      }
    } catch (e) {
      console.warn("Storage parse error, using defaults", e);
    }
    return initialPortfolioData;
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Toggle visual builder edit mode
  const toggleEditMode = () => {
    setIsEditMode((prev) => {
      const next = !prev;
      localStorage.setItem("portfolio_edit_mode", String(next));
      return next;
    });
  };

  // Immediate save to persistence
  const saveAllChanges = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setHasUnsavedChanges(false);
      return true;
    } catch (e) {
      console.error("Save error", e);
      return false;
    }
  };

  // Reset to initial code defaults
  const resetAllToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(initialPortfolioData);
    setHasUnsavedChanges(false);
  };

  // Profile fields update
  const updateProfileField = (key, value) => {
    setData((prev) => {
      const next = {
        ...prev,
        profile: { ...prev.profile, [key]: value },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setHasUnsavedChanges(true);
  };

  // Section toggle
  const toggleSection = (sectionKey) => {
    setData((prev) => {
      const next = {
        ...prev,
        sectionVisibility: {
          ...prev.sectionVisibility,
          [sectionKey]: !prev.sectionVisibility[sectionKey],
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setHasUnsavedChanges(true);
  };

  // Projects actions
  const toggleProjectVisibility = (id) => {
    setData((prev) => {
      const next = {
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === id ? { ...p, visible: !p.visible } : p
        ),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const updateProject = (id, fields) => {
    setData((prev) => {
      const next = {
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === id ? { ...p, ...fields } : p
        ),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const addProject = (newProj) => {
    const item = {
      id: "proj-" + Date.now(),
      title: newProj?.title || "New Project Title",
      subtitle: newProj?.subtitle || "Category / Subtitle",
      image: newProj?.image || "/assets/truth.png",
      visible: true,
      lead: newProj?.lead || "Short description of what was engineered...",
      more: newProj?.more || ["Deep dive paragraph about tools and architecture..."],
      techStack: newProj?.techStack || ["Python", "Docker", "API"],
      link: newProj?.link || "https://github.com/guyo-halake",
    };
    setData((prev) => {
      const next = {
        ...prev,
        projects: [...prev.projects, item],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const deleteProject = (id) => {
    setData((prev) => {
      const next = {
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setHasUnsavedChanges(true);
  };

  // Hardware actions
  const toggleHardwareVisibility = (id) => {
    setData((prev) => {
      const next = {
        ...prev,
        hardware: prev.hardware.map((h) =>
          h.id === id ? { ...h, visible: !h.visible } : h
        ),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const updateHardware = (id, fields) => {
    setData((prev) => {
      const next = {
        ...prev,
        hardware: prev.hardware.map((h) =>
          h.id === id ? { ...h, ...fields } : h
        ),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const addHardware = (newHw) => {
    const item = {
      id: "hw-" + Date.now(),
      title: newHw?.title || "New Hardware / Rig",
      subtitle: newHw?.subtitle || "Architecture / Purpose",
      image: newHw?.image || "/assets/hardware/pc/images/cover.png",
      visible: true,
      lead: newHw?.lead || "Hardware overview and purpose...",
      more: newHw?.more || ["Processor / Specs point 1", "RAM / Storage point 2"],
      techStack: newHw?.techStack || ["Hardware", "Linux", "RAM"],
    };
    setData((prev) => {
      const next = {
        ...prev,
        hardware: [...prev.hardware, item],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const deleteHardware = (id) => {
    setData((prev) => {
      const next = {
        ...prev,
        hardware: prev.hardware.filter((h) => h.id !== id),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setHasUnsavedChanges(true);
  };

  // Aliases for bulk operations or Admin dashboard compatibility
  const updateProfile = (newProfile) => {
    setData((prev) => {
      const next = {
        ...prev,
        profile: { ...prev.profile, ...newProfile },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const saveProject = (proj) => {
    if (!proj) return;
    const exists = data.projects.some((p) => p.id === proj.id);
    if (exists) {
      updateProject(proj.id, proj);
    } else {
      addProject(proj);
    }
  };

  const saveHardware = (item) => {
    if (!item) return;
    const exists = data.hardware.some((h) => h.id === item.id);
    if (exists) {
      updateHardware(item.id, item);
    } else {
      addHardware(item);
    }
  };

  const exportDataJSON = () => {
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === "object") {
        setData(parsed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        setHasUnsavedChanges(false);
        return true;
      }
    } catch (e) {
      console.error("Import failed", e);
    }
    return false;
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isEditMode,
        setIsEditMode,
        toggleEditMode,
        profile: data.profile,
        sectionVisibility: data.sectionVisibility,
        projects: data.projects,
        hardware: data.hardware,
        hasUnsavedChanges,
        saveAllChanges,
        resetAllToDefaults,
        resetToDefaults: resetAllToDefaults,
        updateProfileField,
        updateProfile,
        toggleSection,
        toggleProjectVisibility,
        updateProject,
        addProject,
        saveProject,
        deleteProject,
        toggleHardwareVisibility,
        updateHardware,
        addHardware,
        saveHardware,
        deleteHardware,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
