import React from "react";
import "../styles/About.css";
import FadeInSection from "./FadeInSection";
import { usePortfolio } from "../context/PortfolioContext";

const About = () => {
  const { profile, isEditMode, updateProfileField } = usePortfolio();

  const skillGroups = [
    {
      category: "Cloud, Infrastructure & DevOps",
      skills: ["Microsoft Azure", "Docker", "Linux (Ubuntu/Alpine)", "GitHub Actions CI/CD", "Nginx", "Tailscale VPN"],
    },
    {
      category: "AI Systems, Agents & Automations",
      skills: ["Model Context Protocol (MCP)", "Google Gemini & Claude Tool-Calling", "n8n Workflow Automation", "Safaricom Daraja API (M-Pesa)", "RAG & Vector Embeddings"],
    },
    {
      category: "Full-Stack Software Engineering",
      skills: ["Python (FastAPI)", "React 18 & TypeScript", "Node.js", "PostgreSQL / Supabase (RLS)", "Tailwind CSS", "RESTful APIs"],
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
            <p
              contentEditable={isEditMode}
              suppressContentEditableWarning={true}
              onBlur={(e) => updateProfileField("aboutParagraphOne", e.currentTarget.textContent)}
              title={isEditMode ? "Click to edit paragraph 1" : undefined}
            >
              {profile.aboutParagraphOne}
            </p>

            <p
              contentEditable={isEditMode}
              suppressContentEditableWarning={true}
              onBlur={(e) => updateProfileField("aboutParagraphTwo", e.currentTarget.textContent)}
              title={isEditMode ? "Click to edit paragraph 2" : undefined}
            >
              {profile.aboutParagraphTwo}
            </p>

            {/* Redesigned Minimalist Skills Badges */}
            <div className="skills-container">
              <div className="skills-section-heading">Technologies I work with:</div>
              {skillGroups.map((group, i) => (
                <div key={i} className="skill-category-block">
                  <div className="skill-category-label">{group.category}</div>
                  <div className="skill-pills-wrap">
                    {group.skills.map((skill, j) => (
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
