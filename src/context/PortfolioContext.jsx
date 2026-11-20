import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { initialPortfolioData } from "../data/portfolioData";

const PortfolioContext = createContext(null);
const STORAGE_KEY = "guyohalake_portfolio_v2_photos_v6";

export const PortfolioProvider = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [recruiterMode, setRecruiterMode] = useState(false);
  const [dbSynced, setDbSynced] = useState(false);
  const [telemetry, setTelemetry] = useState(null);

  // Primary state initialized from local cache or code defaults
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

  // Hydrate from SQLite database on mount
  useEffect(() => {
    let isMounted = true;
    const fetchRemoteData = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (!res.ok) return;
        const result = await res.json();
        if (result.success && result.data && isMounted) {
          setData(result.data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data));
          setDbSynced(true);
        } else if (result.source === "default") {
          // Database is clean: push current baseline to DB
          fetch("/api/portfolio", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data }),
          }).catch(() => {});
        }
      } catch (err) {
        console.warn("API unreachable, falling back to local storage cache:", err);
      }
    };

    const fetchTelemetry = async () => {
      try {
        const res = await fetch("/api/telemetry");
        if (res.ok) {
          const t = await res.json();
          if (isMounted) setTelemetry(t);
        }
      } catch (e) {}
    };

    fetchRemoteData();
    fetchTelemetry();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to backend SQLite DB helper
  const syncToDatabase = useCallback(async (nextState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: nextState }),
      });
      if (res.ok) {
        setDbSynced(true);
        setHasUnsavedChanges(false);
      }
    } catch (err) {
      console.warn("Failed to sync to database, saved locally:", err);
    }
  }, []);

  // Toggle visual builder edit mode
  const toggleEditMode = () => {
    setIsEditMode((prev) => {
      const next = !prev;
      localStorage.setItem("portfolio_edit_mode", String(next));
      return next;
    });
  };

  // Toggle Recruiter Brief / Dossier Mode
  const toggleRecruiterMode = () => {
    setRecruiterMode((prev) => !prev);
  };

  // Immediate save to persistence (local + DB)
  const saveAllChanges = async () => {
    try {
      await syncToDatabase(data);
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
    syncToDatabase(initialPortfolioData);
    setHasUnsavedChanges(false);
  };

  // Profile fields update
  const updateProfileField = (key, value) => {
    setData((prev) => {
      const next = {
        ...prev,
        profile: { ...prev.profile, [key]: value },
      };
      syncToDatabase(next);
      return next;
    });
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
      syncToDatabase(next);
      return next;
    });
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
      syncToDatabase(next);
      return next;
    });
  };

  const updateProject = (id, fields) => {
    setData((prev) => {
      const next = {
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === id ? { ...p, ...fields } : p
        ),
      };
      syncToDatabase(next);
      return next;
    });
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
      syncToDatabase(next);
      return next;
    });
  };

  const deleteProject = (id) => {
    setData((prev) => {
      const next = {
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id),
      };
      syncToDatabase(next);
      return next;
    });
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
      syncToDatabase(next);
      return next;
    });
  };

  const updateHardware = (id, fields) => {
    setData((prev) => {
      const next = {
        ...prev,
        hardware: prev.hardware.map((h) =>
          h.id === id ? { ...h, ...fields } : h
        ),
      };
      syncToDatabase(next);
      return next;
    });
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
      syncToDatabase(next);
      return next;
    });
  };

  const deleteHardware = (id) => {
    setData((prev) => {
      const next = {
        ...prev,
        hardware: prev.hardware.filter((h) => h.id !== id),
      };
      syncToDatabase(next);
      return next;
    });
  };

  // Aliases for bulk operations or Admin dashboard compatibility
  const updateProfile = (newProfile) => {
    setData((prev) => {
      const next = {
        ...prev,
        profile: { ...prev.profile, ...newProfile },
      };
      syncToDatabase(next);
      return next;
    });
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
        syncToDatabase(parsed);
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
        recruiterMode,
        setRecruiterMode,
        toggleRecruiterMode,
        dbSynced,
        telemetry,
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
