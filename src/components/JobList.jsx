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
  "Mobit Solutions": {
    role: "Software Developer",
    company: "Mobit Solutions",
    period: "Nov 2024 – Jan 2025",
    location: "Remote",
    bullets: [
      "Engineered production web applications and RESTful backend services using React, TypeScript, Node.js, and MySQL—implementing complex data-driven forms, role-based dashboards, and multi-tenant business logic.",
      "Collaborated with an agile remote engineering team using Jira for sprint planning and GitHub for pull request workflows, feature branching, and peer code reviews.",
    ],
  },
  "AO Technologies Group": {
    role: "DevOps & Cloud Infrastructure Engineer",
    company: "AO Technologies Group",
    period: "May 2024 – Aug 2024",
    location: "Nairobi, Kenya",
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
    company: "Muthokinju Paints & Cement",
    period: "Feb 2024 – Oct 2024",
    location: "Nairobi, Kenya",
    bullets: [
      "Administered Microsoft Active Directory across the organization—managing user lifecycle events, Group Policy Objects, security group memberships, and enterprise password policies for headquarters and branch staff.",
      "Diagnosed and resolved critical failures in enterprise Point of Sale (POS) infrastructure and internal business management systems, maintaining operational continuity for retail, logistics, and warehouse workflows.",
      "Deployed and configured commercial-grade networking infrastructure including managed switches, commercial access points, and CCTV surveillance systems across headquarters and branch sites.",
      "Monitored and administered hybrid infrastructure spanning physical on-premise servers and cloud VMs—executing routine uptime checks, disk health audits, and backup verification.",
      "Triaged and resolved IT service tickets from multi-department users including logistics coordinators, warehouse supervisors, and finance officers, consistently meeting resolution SLAs.",
    ],
  },
};

const JobList = () => {
  const [workTab, setWorkTab] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const renderSection = (items, tab, setTab) => (
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
            <div className="joblist-header-box">
              <h3 className="joblist-job-title">{items[key].role}</h3>
              <div className="joblist-company-row">
                {items[key].link ? (
                  <a
                    href={items[key].link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="joblist-job-company"
                  >
                    {items[key].company || key} ↗
                  </a>
                ) : (
                  <span className="joblist-job-company">{items[key].company || key}</span>
                )}
                {items[key].location && (
                  <span className="joblist-job-location">· {items[key].location}</span>
                )}
              </div>
              <div className="joblist-duration">{items[key].period}</div>
            </div>
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
      {renderSection(workExperience, workTab, setWorkTab)}
    </div>
  );
};

export default JobList;