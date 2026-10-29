import React from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import FadeInSection from "./FadeInSection";

function TabPanel({ children, value, index, isMobile, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={isMobile ? `full-width-tabpanel-${index}` : `vertical-tabpanel-${index}`}
      aria-labelledby={isMobile ? `full-width-tab-${index}` : `vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  isMobile: PropTypes.bool,
};

function a11yProps(index, isMobile) {
  return {
    id: (isMobile ? "full-width-tab-" : "vertical-tab-") + index,
    "aria-controls": (isMobile ? "full-width-tabpanel-" : "vertical-tabpanel-") + index,
  };
}

const tabSx = (isMobile) => ({
  color: "var(--slate)",
  fontFamily: "NTR",
  fontSize: "14px",
  textAlign: isMobile ? "center" : "left",
  alignItems: isMobile ? "center" : "flex-start",
  textTransform: "none",
  padding: "10px 20px",
  minHeight: "48px",
  minWidth: isMobile ? "120px" : "auto",
  "&.Mui-selected": { color: "var(--green-bright)" },
  "&:hover": { color: "var(--green-bright)", backgroundColor: "var(--green-tint)" },
});

// ─── Work Experience ────────────────────────────────────────────────────────
const workExperience = {
  "AO Technologies Group": {
    role: "DevOps & Cloud Infrastructure Engineer",
    period: "May 2026 – Aug 2026 · Nairobi, Kenya",
    bullets: [
      "Provisioned and organized Microsoft Azure cloud resources using Resource Groups to logically segment infrastructure by application, project scope, and deployment environment.",
      "Configured Azure Role-Based Access Control (RBAC) to enforce least-privilege security and granular access control for engineering teams.",
      "Monitored Azure subscription costs, identified spending anomalies, and supported budget alerts to optimize cloud resource efficiency.",
      "Developed and maintained automated CI/CD pipelines (YAML) in GitHub Actions and GitLab CI, automating dependency resolution, testing, application builds, and environment deployments.",
      "Implemented standardized build and release processes to ensure reliable, zero-drift deployments across development and staging workflows.",
    ],
  },
  "Muthokinju Paints & Cement": {
    role: "IT Support & Systems Infrastructure Technician",
    period: "Feb 2026 – Present · Nairobi, Kenya (HQ)",
    bullets: [
      "Administered Microsoft Active Directory across the organization—managing user lifecycle events (onboarding, role transitions, offboarding), Group Policy Objects, security group memberships, and enterprise password policies for headquarters and branch staff.",
      "Diagnosed and resolved critical failures in enterprise Point of Sale (POS) infrastructure and internal business management systems, maintaining operational continuity for retail, logistics, and warehouse workflows.",
      "Deployed and configured commercial-grade networking infrastructure including managed switches, commercial-access-point Wi-Fi networks, and CCTV surveillance systems across headquarters and branch sites.",
      "Monitored and administered hybrid infrastructure spanning physical on-premise servers and cloud VMs—executing routine uptime checks, disk health audits, backup verification, and capacity planning.",
      "Triaged and resolved IT service tickets from multi-department users including logistics coordinators, warehouse supervisors, and finance officers, consistently meeting resolution SLAs.",
    ],
  },
  "Mobit Solutions": {
    role: "Software Developer (Remote)",
    period: "Nov 2025 – Present",
    bullets: [
      "Engineered production web applications and RESTful backend services using React, TypeScript, Node.js, and MySQL—implementing complex data-driven forms, role-based dashboards, and multi-tenant business logic.",
      "Collaborated with an agile remote engineering team using Jira for sprint planning and GitHub for pull request workflows, feature branching, and peer code reviews.",
    ],
  },
};

// ─── Project Experience ─────────────────────────────────────────────────────
const projectExperience = {
  "Odin Bot": {
    role: "Personal Telegram Agent",
    period: "Personal Project",
    link: "https://github.com/guyo-halake",
    bullets: [
      "An AI agent that turns Telegram messages into actions on my machine. It uses the Google Gemini API for LLM tool-calling, allowing me to give instructions in natural language and have the agent select tools, execute actions, and work through multi-step tasks.",
      "The agent connects to my local Windows machine to read and write files and execute shell commands, integrates with Apple Calendar for scheduling and reminders, and uses MCP to delegate coding and debugging tasks to Claude Code and Antigravity.",
      "I designed the tool registry and prompt architecture that connect these capabilities, allowing the model to use tool results to decide what to do next.",
      "Odin Bot brings together LLM agent development, tool orchestration, prompt engineering, MCP integration and local system automation in one application.",
      "Tech stack: OpenClaw · n8n · Python Automation · Google Gemini API · Telegram Bot API · Apple/Notion Calendar · Prompt Engineering · Multi-Step Agent Workflows · MCP · LLM Tool-Calling",
    ],
  },
  "Multi-Source Enterprise MCP Server": {
    role: "Context Layer & Agent Tooling",
    period: "Personal Project",
    link: "https://github.com/guyo-halake",
    bullets: [
      "An MCP server that gives AI agents a unified interface to structured business data, internal documentation, and team communications. Connects PostgreSQL/Supabase, Notion, and Slack.",
      "Allows an agent to retrieve relevant records and documentation, work with team discussions, and execute supported actions across different systems.",
      "Engineered with tool design across different data sources, token budget management, and OAuth2 permission scopes.",
      "Tech stack: Python · FastMCP · MCP · PostgreSQL/Supabase · Notion API · Slack API · OAuth2 · RAG · Context Management",
    ],
  },
  "AI-Powered Azure DevOps Agent": {
    role: "Agentic Workflows & Lab Operations",
    period: "Personal Project",
    link: "https://github.com/guyo-halake/AZURE-FUNDAMENTALS-LAB-AND",
    bullets: [
      "An AI-powered DevOps agent that helps me manage my Azure lab through OpenClaw, n8n workflows, and Python automations.",
      "Triggers deployments, checks GitHub issues, inspects issues affecting the Azure lab, and suggests actionable tasks based on the work that needs attention.",
      "Brings issue review, task recommendations, and deployment operations into one connected system rather than separate manual steps.",
      "Tech stack: OpenClaw · n8n · Python Automation · GitHub · Microsoft Azure · CI/CD · Agentic Workflows · Workflow Orchestration",
    ],
  },
};

const JobList = () => {
  const [workTab, setWorkTab] = React.useState(0);
  const [projTab, setProjTab] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const renderSection = (items, tab, setTab, idPrefix) => (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "transparent",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        minHeight: 280,
        mb: 6,
      }}
    >
      <Tabs
        orientation={isMobile ? "horizontal" : "vertical"}
        variant="scrollable"
        scrollButtons="auto"
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          borderRight: isMobile ? 0 : 1,
          borderBottom: isMobile ? 1 : 0,
          borderColor: "var(--lightest-navy)",
          "& .MuiTabs-indicator": { backgroundColor: "var(--green-bright)" },
          "& .MuiTabs-flexContainer": {
            borderBottom: isMobile ? "1px solid var(--lightest-navy)" : "none",
          },
        }}
      >
        {Object.keys(items).map((key, i) => (
          <Tab key={i} label={key} {...a11yProps(i, isMobile)} sx={tabSx(isMobile)} />
        ))}
      </Tabs>
      <Box sx={{ flexGrow: 1 }}>
        {Object.keys(items).map((key, i) => (
          <TabPanel key={i} value={tab} index={i} isMobile={isMobile}>
            <span className="joblist-job-title">{items[key].role}</span>
            {items[key].link && (
              <>
                {" "}
                <a
                  href={items[key].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="joblist-job-company"
                >
                  ↗ {key}
                </a>
              </>
            )}
            {!items[key].link && (
              <span className="joblist-job-company"> @ {key}</span>
            )}
            <div className="joblist-duration">{items[key].period}</div>
            <ul className="job-description">
              {items[key].bullets.map((b, j) => (
                <FadeInSection key={j} delay={(j + 1) * 100 + "ms"}>
                  <li>{b}</li>
                </FadeInSection>
              ))}
            </ul>
          </TabPanel>
        ))}
      </Box>
    </Box>
  );

  return (
    <div>
      <div className="exp-subsection-label">Work Experience</div>
      {renderSection(workExperience, workTab, setWorkTab, "work")}
      {/* Project Experience commented out to keep projects exclusive to the /projects section */}
      {/*
      <div className="exp-subsection-label">Project Experience</div>
      {renderSection(projectExperience, projTab, setProjTab, "proj")}
      */}
    </div>
  );
};

export default JobList;
