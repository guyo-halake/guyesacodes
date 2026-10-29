import React, { useState } from "react";
import "../styles/Projects.css";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import FadeInSection from "./FadeInSection";
import ExternalLinks from "./ExternalLinks";

const projects = [
  {
    title: "Odin Bot",
    subtitle: "Personal Telegram Agent",
    image: "/assets/truth.png",
    lead: "An AI agent that turns Telegram messages into actions on my machine. It uses the Google Gemini API for LLM tool-calling, allowing me to give instructions in natural language and have the agent select tools, execute actions, and work through multi-step tasks.",
    more: [
      "The agent connects to my local Windows machine to read and write files and execute shell commands, integrates with Apple Calendar for scheduling and reminders, and uses MCP to delegate coding and debugging tasks to Claude Code and Antigravity. I designed the tool registry and prompt architecture that connect these capabilities, allowing the model to use tool results to decide what to do next.",
      "Odin Bot brings together LLM agent development, tool orchestration, prompt engineering, MCP integration and local system automation in one application.",
    ],
    techStack: [
      "OpenClaw",
      "n8n",
      "Python Automation",
      "Google Gemini API",
      "Telegram Bot API",
      "Apple/Notion Calendar",
      "Prompt Engineering",
      "Multi-Step Agent Workflows",
      "MCP",
      "LLM Tool-Calling",
    ],
    link: "https://github.com/guyo-halake",
  },
  {
    title: "Multi-Source Enterprise MCP Server",
    subtitle: "Context Layer & Agent Tooling",
    image: "/assets/portfolio.png",
    lead: "An MCP server that gives AI agents a unified interface to structured business data, internal documentation, and team communications. It connects PostgreSQL/Supabase, Notion, and Slack, allowing an agent to retrieve relevant records and documentation, work with team discussions, and execute supported actions across different systems.",
    more: [
      "The engineering focuses on more than connecting APIs: designing tools across different data sources, retrieving relevant context, managing token budgets, and applying OAuth2 permission scopes so the agent can work within the access granted to each integration. The result is a shared context and action layer that agents can use without requiring a separate, one-off integration for every workflow.",
    ],
    techStack: [
      "Python",
      "FastMCP",
      "MCP",
      "PostgreSQL/Supabase",
      "Notion API",
      "Slack API",
      "OAuth2",
      "RAG",
      "Context Management",
    ],
    link: "https://github.com/guyo-halake",
  },
  {
    title: "AI-Powered Azure DevOps Agent",
    subtitle: "Agentic Workflows & Lab Operations",
    image: "/assets/nomansland.png",
    lead: "An AI-powered DevOps agent that helps me manage my Azure lab through OpenClaw, n8n workflows, and Python automations. It can trigger deployments, check GitHub issues, inspect issues affecting the Azure lab, and suggest actionable tasks based on the work that needs attention.",
    more: [
      "OpenClaw provides the agent layer, while n8n connects the workflows and Python handles custom automation. This brings issue review, task recommendations, and deployment operations into one connected system rather than leaving them as separate manual steps.",
      "The focus is on building an agent that can do more than explain DevOps tasks: it can gather operational context, identify work that needs attention, and initiate defined workflows to carry out actions.",
    ],
    techStack: [
      "OpenClaw",
      "n8n",
      "Python Automation",
      "GitHub",
      "Microsoft Azure",
      "CI/CD",
      "Agentic Workflows",
      "Workflow Orchestration",
    ],
    link: "https://github.com/guyo-halake/AZURE-FUNDAMENTALS-LAB-AND",
  },
];

const Projects = () => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (idx) => {
    setExpanded((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div id="projects">
      <FadeInSection>
        <div className="section-header">
          <span className="section-title">/ projects</span>
          <a
            href="https://github.com/guyo-halake"
            className="explore-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            View all on GitHub
          </a>
        </div>

        {/* 3-Card Horizontal Grid */}
        <div className="projects-grid-3">
          {projects.map((proj, idx) => {
            const isExpanded = !!expanded[idx];
            return (
              <FadeInSection key={idx} delay={(idx + 1) * 100 + "ms"}>
                <div className="project-grid-card">
                  {/* Card Header */}
                  <div className="project-card-top">
                    <div className="project-folder-icon">
                      <FolderOpenRoundedIcon sx={{ fontSize: 32 }} />
                    </div>
                    <ExternalLinks githubLink={proj.link} />
                  </div>

                  {/* Embedded Project Image */}
                  <div className="project-card-image-box">
                    <img src={proj.image} alt={proj.title} />
                  </div>

                  {/* Title & Subtitle */}
                  <div className="project-card-heading">
                    <h3 className="project-card-title">
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {proj.title}
                      </a>
                    </h3>
                    <div className="project-card-subtitle">
                      {proj.subtitle}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="project-card-body">
                    <p className="project-lead-text">{proj.lead}</p>

                    {isExpanded && (
                      <div className="project-expanded-text">
                        {proj.more.map((paragraph, pIdx) => (
                          <p key={pIdx}>{paragraph}</p>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      className="project-toggle-btn"
                      onClick={() => toggleExpand(idx)}
                    >
                      {isExpanded ? "Show less" : "Show more"}
                    </button>
                  </div>

                  {/* Tech Stack Tags at bottom */}
                  <div className="project-card-tech">
                    {proj.techStack.map((tech, tIdx) => (
                      <span key={tIdx} className="tech-pill">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeInSection>
            );
          })}
        </div>
      </FadeInSection>
    </div>
  );
};

export default Projects;
