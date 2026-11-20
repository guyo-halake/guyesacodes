import React from "react";
import "../styles/About.css";
import FadeInSection from "./FadeInSection";
import { usePortfolio } from "../context/PortfolioContext";

const About = () => {
  const { profile, isEditMode, updateProfileField } = usePortfolio();

  const techRows = [
    {
      label: "AI & Automations",
      skills: ["Tool calling LLMs", "RAG and Vector Databases", "n8n workflow automations", "MCP"],
    },
    {
      label: "Software & Cloud",
      skills: ["Python", "React and TypeScript", "JavaScript", "AWS (EC2, S3)", "Docker"],
    },
  ];

  return (
    <div id="about">
      <FadeInSection>
        <div className="section-header">
          <span className="section-title">/ about</span>
        </div>

        <div className="about-content">
          <div className="about-description">
            {profile.aboutParagraphOne && (
              <p
                contentEditable={isEditMode}
                suppressContentEditableWarning={true}
                onBlur={(e) => updateProfileField("aboutParagraphOne", e.currentTarget.textContent)}
                title={isEditMode ? "Click to edit paragraph" : undefined}
              >
                {profile.aboutParagraphOne}
              </p>
            )}

            {/* Clean Tech Stack Section */}
            <div className="skills-container" style={{ marginTop: "16px" }}>
              <div className="skills-section-heading" style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
                Tech Stack
              </div>
              {techRows.map((row, i) => (
                <div key={i} className="skill-category-block" style={{ marginBottom: "14px" }}>
                  <div className="skill-pills-wrap">
                    {row.skills.map((skill, j) => (
                      <span key={j} className="skill-chip">
                        <span className="skill-chip-dot" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-image">
            <img alt="Guyo Halake" src={profile.avatarImage || "/assets/me2.jpg"} />
            {isEditMode && (
              <button
                type="button"
                className="builder-avatar-change-btn"
                onClick={() => {
                  const url = window.prompt("Enter image path or URL for your profile photo:", profile.avatarImage || "/assets/me2.jpg");
                  if (url) updateProfileField("avatarImage", url);
                }}
              >
                Change Photo
              </button>
            )}
          </div>
        </div>
      </FadeInSection>
    </div>
  );
};

export default About;
