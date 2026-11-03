import React from "react";
import "../styles/About.css";
import FadeInSection from "./FadeInSection";
import { usePortfolio } from "../context/PortfolioContext";

const About = () => {
  const { profile, isEditMode, updateProfileField } = usePortfolio();

  const skills = [
    {
      category: "Cloud & DevOps",
      items: [
        "Microsoft Azure",
        "Docker & Containerization",
        "GitHub Actions & GitLab CI",
        "Linux Server Administration",
      ],
    },
    {
      category: "AI Agents & Automation",
      items: [
        "Google Gemini API & Tool-Calling",
        "Claude Code & MCP Architecture",
        "OpenClaw & n8n Workflows",
        "Python System Automation",
      ],
    },
    {
      category: "Software Engineering",
      items: [
        "Python",
        "React & TypeScript",
        "Node.js & REST APIs",
      ],
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

            <div className="skills-grid">
              {skills.map((group, i) => (
                <FadeInSection key={i} delay={(i + 1) * 100 + "ms"}>
                  <div className="skill-group">
                    <div className="skill-group-title">{group.category}</div>
                    <ul className="tech-stack">
                      {group.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </FadeInSection>
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
