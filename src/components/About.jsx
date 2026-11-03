import React from "react";
import "../styles/About.css";
import FadeInSection from "./FadeInSection";
import { usePortfolio } from "../context/PortfolioContext";

const About = () => {
  const { profile } = usePortfolio();

  const one = (
    <p>
      {profile.aboutParagraphOne}
    </p>
  );

  const two = (
    <p>
      {profile.aboutParagraphTwo}
    </p>
  );

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
            {one}
            {two}
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
          </div>
        </div>
      </FadeInSection>
    </div>
  );
};

export default About;
