import React, { createContext, useContext, useState, useEffect } from "react";
import { initialPortfolioData } from "../data/portfolioData";

const PortfolioContext = createContext(null);
const STORAGE_KEY = "guyohalake_portfolio_v2_data";

export const PortfolioProvider = ({ children }) => {
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
      console.warn("Failed to read from localStorage, using initial data", e);
    }
    return initialPortfolioData;
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to persist portfolio data", e);
    }
  }, [data]);

  // Profile actions
  const updateProfile = (fields) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...fields },
    }));
  };

  // Section visibility actions
  const toggleSection = (sectionKey) => {
    setData((prev) => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [sectionKey]: !prev.sectionVisibility[sectionKey],
      },
    }));
  };

  // Projects actions
  const toggleProjectVisibility = (id) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === id ? { ...p, visible: !p.visible } : p
      ),
    }));
  };

  const saveProject = (project) => {
    setData((prev) => {
      const exists = prev.projects.some((p) => p.id === project.id);
      if (exists) {
        return {
          ...prev,
          projects: prev.projects.map((p) => (p.id === project.id ? project : p)),
        };
      } else {
        const newProj = {
          ...project,
          id: project.id || "proj-" + Date.now(),
          visible: project.visible !== undefined ? project.visible : true,
        };
        return {
          ...prev,
          projects: [newProj, ...prev.projects],
        };
      }
    });
  };

  const deleteProject = (id) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  // Hardware actions
  const toggleHardwareVisibility = (id) => {
    setData((prev) => ({
      ...prev,
      hardware: prev.hardware.map((h) =>
        h.id === id ? { ...h, visible: !h.visible } : h
      ),
    }));
  };

  const saveHardware = (item) => {
    setData((prev) => {
      const exists = prev.hardware.some((h) => h.id === item.id);
      if (exists) {
        return {
          ...prev,
          hardware: prev.hardware.map((h) => (h.id === item.id ? item : h)),
        };
      } else {
        const newItem = {
          ...item,
          id: item.id || "hw-" + Date.now(),
          visible: item.visible !== undefined ? item.visible : true,
        };
        return {
          ...prev,
          hardware: [newItem, ...prev.hardware],
        };
      }
    });
  };

  const deleteHardware = (id) => {
    setData((prev) => ({
      ...prev,
      hardware: prev.hardware.filter((h) => h.id !== id),
    }));
  };

  // Reset to original default data
  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(initialPortfolioData);
  };

  // Export / Import JSON for easy backup and cross-device sync
  const exportDataJSON = () => {
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      setData(parsed);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        profile: data.profile,
        sectionVisibility: data.sectionVisibility,
        projects: data.projects,
        hardware: data.hardware,
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

