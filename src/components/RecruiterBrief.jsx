import React, { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import "../styles/RecruiterBrief.css";

const RecruiterBrief = () => {
  const { recruiterMode, toggleRecruiterMode, telemetry, profile } = usePortfolio();
  const [activeTab, setActiveTab] = useState("overview");

  if (!recruiterMode) return null;

  return (
    <div className="recruiter-modal-overlay" onClick={toggleRecruiterMode}>
      <div className="recruiter-modal" onClick={(e) => e.stopPropagation()}>
        <div className="recruiter-modal-header">
          <div className="recruiter-title-area">
            <span className="recruiter-pill">RECRUITER 60-SEC DOSSIER</span>
            <h2>Guyo Halake</h2>
            <p className="recruiter-tagline">
              Cloud Systems &amp; Autonomous AI Automation Engineer · Nairobi, Kenya (Remote Ready)
            </p>
          </div>
          <button className="recruiter-close-btn" onClick={toggleRecruiterMode}>
            ✕
          </button>
        </div>

        {/* Live Telemetry Status Bar */}
        <div className="telemetry-bar">
          <div className="telemetry-item">
            <span className="telemetry-dot online"></span>
            <span className="telemetry-label">Cloud:</span>
            <span className="telemetry-val">Azure App Service ({telemetry?.cloud?.uptime || "99.98%"})</span>
          </div>
          <div className="telemetry-item">
            <span className="telemetry-dot online"></span>
            <span className="telemetry-label">Edge Node:</span>
            <span className="telemetry-val">Ubuntu Server (Tailscale Mesh)</span>
          </div>
          <div className="telemetry-item">
            <span className="telemetry-dot online"></span>
            <span className="telemetry-label">Database:</span>
            <span className="telemetry-val">SQLite (Persistent WAL Mode)</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="recruiter-tabs">
          <button
            className={`recruiter-tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Executive Summary
          </button>
          <button
            className={`recruiter-tab ${activeTab === "stack" ? "active" : ""}`}
            onClick={() => setActiveTab("stack")}
          >
            Core Competency Matrix
          </button>
          <button
            className={`recruiter-tab ${activeTab === "caseStudies" ? "active" : ""}`}
            onClick={() => setActiveTab("caseStudies")}
          >
            Verified Case Studies
          </button>
        </div>

        {/* Tab Content */}
        <div className="recruiter-modal-body">
          {activeTab === "overview" && (
            <div className="tab-pane">
              <div className="dossier-grid">
                <div className="dossier-card highlight">
                  <h4>Why Hire Guyo?</h4>
                  <ul>
                    <li>
                      <strong>Autonomous AI &amp; Tool Calling:</strong> Architected production multi-tenant AI systems featuring 6 integrated MCP servers, RAG vector retrieval, and automated live M-Pesa payments.
                    </li>
                    <li>
                      <strong>Enterprise Microsoft Azure:</strong> Deploys containerized Linux services, zero-trust Tailscale networks, Docker microservices, and automated GitHub Actions CI/CD pipelines.
                    </li>
                    <li>
                      <strong>Production Legal SaaS:</strong> Built and shipped the Bill of Costs platform for Nyagah B. Kithinji Advocates, automating court taxation schedules by 80%+.
                    </li>
                    <li>
                      <strong>Real Full-Stack Core:</strong> Strong Python (FastAPI/Flask), Node.js/Express, React 18, TypeScript, and SQL foundations.
                    </li>
                  </ul>
                </div>

                <div className="dossier-card">
                  <h4>Key Metrics &amp; Availability</h4>
                  <div className="metrics-list">
                    <div className="metric-box">
                      <span className="num">Production</span>
                      <span className="lbl">Legal-Tech SaaS in active legal firm use</span>
                    </div>
                    <div className="metric-box">
                      <span className="num">6 MCP Servers</span>
                      <span className="lbl">Autonomous tools connected via Model Context Protocol</span>
                    </div>
                    <div className="metric-box">
                      <span className="num">&lt; 40MB</span>
                      <span className="lbl">Optimized Alpine Docker production images</span>
                    </div>
                    <div className="metric-box">
                      <span className="num">Immediate</span>
                      <span className="lbl">Notice Period / Available for Global Remote or Hybrid</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "stack" && (
            <div className="tab-pane">
              <div className="stack-category">
                <h4>1. AI Engineering &amp; Agent Tooling</h4>
                <div className="badge-row">
                  <span className="badge ai">Model Context Protocol (MCP)</span>
                  <span className="badge ai">Retrieval-Augmented Generation (RAG)</span>
                  <span className="badge ai">n8n Workflow Automation</span>
                  <span className="badge ai">Google Gemini 1.5 Flash</span>
                  <span className="badge ai">Claude 3.5 Sonnet Tool Calling</span>
                  <span className="badge ai">WhatsApp Cloud API / WAHA</span>
                  <span className="badge ai">Vector Search &amp; Embeddings</span>
                </div>
              </div>

              <div className="stack-category">
                <h4>2. Cloud Infrastructure, Security &amp; DevOps</h4>
                <div className="badge-row">
                  <span className="badge cloud">Microsoft Azure (App Service, VMs, VNet)</span>
                  <span className="badge cloud">Docker &amp; Multi-Stage Alpine Builds</span>
                  <span className="badge cloud">GitHub Actions CI/CD</span>
                  <span className="badge cloud">Tailscale Zero-Trust Mesh VPN</span>
                  <span className="badge cloud">Nginx Reverse Proxy &amp; SSL/TLS</span>
                  <span className="badge cloud">Linux Administration (Ubuntu Server)</span>
                </div>
              </div>

              <div className="stack-category">
                <h4>3. Full-Stack Software Engineering</h4>
                <div className="badge-row">
                  <span className="badge dev">Python (FastAPI, Pandas, Scripting)</span>
                  <span className="badge dev">Node.js &amp; Express</span>
                  <span className="badge dev">React 18 &amp; TypeScript</span>
                  <span className="badge dev">PostgreSQL (RLS Tenant Isolation)</span>
                  <span className="badge dev">SQLite (WAL Architecture)</span>
                  <span className="badge dev">Safaricom Daraja API (M-Pesa STK Push)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "caseStudies" && (
            <div className="tab-pane">
              <div className="case-study-item">
                <div className="cs-header">
                  <h5>Odin — Enterprise Multi-Tenant AI Platform</h5>
                  <span className="cs-tag">AI + Fintech + Cloud</span>
                </div>
                <p>
                  <strong>Challenge:</strong> Businesses losing customer leads due to slow WhatsApp responses and lack of payment integrations.
                </p>
                <p>
                  <strong>Architecture:</strong> Orchestrated Google Gemini &amp; Claude tool-calling with 6 MCP servers connecting n8n, Meta API, and Daraja M-Pesa. Features tenant-isolated Supabase PostgreSQL with real-time operator intervention.
                </p>
              </div>

              <div className="case-study-item">
                <div className="cs-header">
                  <h5>Nyagah B. Kithinji Advocates — Bill of Costs SaaS</h5>
                  <span className="cs-tag">Legal-Tech + Azure</span>
                </div>
                <p>
                  <strong>Challenge:</strong> Manual Kenyan Advocates Remuneration taxation schedules taking 40+ hours per month per advocate.
                </p>
                <p>
                  <strong>Architecture:</strong> FastAPI computation engine with React 18, containerized in an ultra-compact Alpine Docker container on Microsoft Azure, decreasing fee note turnarounds by over 80%.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="recruiter-modal-footer">
          <div className="footer-links">
            <a
              href="mailto:guyohalakeofficial@gmail.com?subject=Job%20Opportunity%20-%20Guyo%20Halake"
              className="btn-primary"
            >
              ✉ Contact Guyo Directly
            </a>
            <a
              href="https://wa.me/254700000000?text=Hi%20Guyo,%20we%20reviewed%20your%20portfolio..."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              WhatsApp Quick Chat
            </a>
            <a
              href="https://github.com/guyo-halake"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              GitHub Repositories
            </a>
          </div>
          <button className="btn-close" onClick={toggleRecruiterMode}>
            Back to Interactive Portfolio
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterBrief;

