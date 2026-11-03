import React from "react";
import "../styles/About.css";
import FadeInSection from "./FadeInSection";
import { usePortfolio } from "../context/PortfolioContext";

const About = () => {
  const { profile, isEditMode, updateProfileField } = usePortfolio();

  const skillGroups = [
    {
      category: "Languages & Frameworks",
      skills: ["Python", "FastAPI", "React", "TypeScript", "Node.js", "Tailwind CSS"],
    },
    {
      category: "Cloud & Infrastructure",
      skills: ["Microsoft Azure", "Docker", "Linux (Ubuntu/Alpine)", "GitHub Actions", "Nginx", "CI/CD"],
    },
    {
      category: "Databases & Tools",
      skills: ["PostgreSQL", "Supabase", "M-Pesa (Daraja API)", "n8n Automations", "Git"],
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
