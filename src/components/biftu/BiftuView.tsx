import React, { useState } from "react";
import { BIFTU_RELEASES, BIFTU_AGENT_CARDS, WORKFLOWBENCH_LEADERBOARD, ABOUT_METRICS, BIFTU_OPEN_ROLES } from "./BiftuData";
import "./BiftuTheme.css";

export const BiftuView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [activeScreen, setActiveScreen] = useState<"home" | "about" | "careers" | "benchmark">("home");

  return (
    <div className="biftu-container">
      {/* Header */}
      <header className="biftu-hdr">
        <div className="biftu-wrap biftu-hdr-inner">
          <a href="#home" className="biftu-brand" onClick={() => setActiveScreen("home")}>
            <span className="biftu-logo-text">Biftu</span>
            <span className="biftu-logo-bracket">[ ]</span>
          </a>

          <nav className="biftu-nav">
            <button 
              className={`biftu-nav-link ${activeScreen === "home" ? "active" : ""}`}
              onClick={() => setActiveScreen("home")}
            >
              Agents
            </button>
            <button 
              className={`biftu-nav-link ${activeScreen === "benchmark" ? "active" : ""}`}
              onClick={() => setActiveScreen("benchmark")}
            >
              WorkflowBench
            </button>
            <button 
              className={`biftu-nav-link ${activeScreen === "about" ? "active" : ""}`}
              onClick={() => setActiveScreen("about")}
            >
              About
            </button>
            <button 
              className={`biftu-nav-link ${activeScreen === "careers" ? "active" : ""}`}
              onClick={() => setActiveScreen("careers")}
            >
              Careers
            </button>
            <a href="mailto:team@biftu.com" className="biftu-btn biftu-btn-fill">
              Try Agents
            </a>
          </nav>
        </div>
      </header>

      {/* Main Screen Switcher */}
      <main className="biftu-main">
        {activeScreen === "home" && (
          <>
            {/* Hero Section */}
            <section className="biftu-sec biftu-hero">
              <div className="biftu-wrap biftu-hero-grid">
                <div className="biftu-hero-content">
                  <h1 className="biftu-h1">
                    Making automations using smart agents for real-world business workflows
                  </h1>
                  <div className="biftu-hero-ctas">
                    <a href="mailto:team@biftu.com" className="biftu-btn biftu-btn-fill">
                      <span>Try Agents</span>
                      <small>Autonomous agents for business workflows</small>
                    </a>
                    <button className="biftu-btn" onClick={() => setActiveScreen("about")}>
                      <span>About Us</span>
                      <small>Our mission, cybersecurity & cloud roots</small>
                    </button>
                  </div>
                </div>

                {/* Releases Ledger */}
                <div className="biftu-ledger">
                  <div className="biftu-ledger-hdr">
                    <span className="biftu-mono-lab">Biftu releases</span>
                    <span className="biftu-mono-lab">Release date</span>
                  </div>
                  <div className="biftu-ledger-rows">
                    {BIFTU_RELEASES.map((rel, idx) => (
                      <div key={idx} className="biftu-ledger-row">
                        <span className="biftu-ix">[{BIFTU_RELEASES.length - 1 - idx}]</span>
                        <div className="biftu-rel-info">
                          <span>{rel.version} · {rel.name}</span>
                          {rel.isNew && <span className="biftu-badge">New</span>}
                        </div>
                        <span className="biftu-rel-date">{rel.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Statement Section */}
            <section className="biftu-sec biftu-statement-sec">
              <div className="biftu-wrap">
                <p className="biftu-statement-text">
                  Today’s frontier models build web apps in seconds, but struggle to execute reliable, multi-step business workflows and mission-critical automations
                </p>
                <div className="biftu-dual-grid">
                  <div className="biftu-box">
                    <span className="biftu-mono-lab">About us</span>
                    <p>We build custom evals, data sets, and refine data for AI agents and real-world business workflow automations.</p>
                    <div className="biftu-stat-row">
                      <strong>24+</strong>
                      <span>Domain engineers registered</span>
                    </div>
                  </div>
                  <div className="biftu-box">
                    <span className="biftu-mono-lab">Our background</span>
                    <p>We come from the Cybersecurity and Cloud industry, where we have helped enterprises secure scalable infrastructure & implement autonomous AI agents in mission-critical business processes.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 6 Agent Cards Section */}
            <section className="biftu-sec biftu-cards-sec">
              <div className="biftu-wrap">
                <header className="biftu-sec-hdr">
                  <h2>Autonomous Agent Solutions & Enterprise Automation Infrastructure</h2>
                  <p>Production-grade multi-tenant agents, omnichannel lead pipelines, and cloud workflows engineered for real business revenue.</p>
                </header>

                <div className="biftu-tabs-grid">
                  {/* Left Interactive Panel */}
                  <div className="biftu-panel-preview">
                    <span className="biftu-mono-lab">
                      [ {BIFTU_AGENT_CARDS[activeTab].number} ] {BIFTU_AGENT_CARDS[activeTab].title}
                    </span>
                    <h3>{BIFTU_AGENT_CARDS[activeTab].youGet}</h3>
                    <div className="biftu-features-list">
                      {BIFTU_AGENT_CARDS[activeTab].features.map((feat, fIdx) => (
                        <div key={fIdx} className="biftu-feature-item">
                          <span className="biftu-bullet">→</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Tabs List */}
                  <div className="biftu-tabs-list">
                    {BIFTU_AGENT_CARDS.map((card, idx) => (
                      <button
                        key={card.id}
                        className={`biftu-tab-item ${activeTab === idx ? "active" : ""}`}
                        onClick={() => setActiveTab(idx)}
                      >
                        <div className="biftu-tab-top">
                          <span className="biftu-mono-lab">[ {card.number} ]</span>
                          <strong>{card.title}</strong>
                        </div>
                        <p>{card.description}</p>
                        <small>YOU GET <em>{card.youGet}</em></small>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Benchmark Screen */}
        {activeScreen === "benchmark" && (
          <section className="biftu-sec">
            <div className="biftu-wrap">
              <header className="biftu-sec-hdr">
                <h2>WorkflowBench: Real-World Business Agent & Automation Benchmark</h2>
                <p>Measures how frontier AI models handle stateful multi-step tool execution, payment safety, and non-deterministic customer dialogs.</p>
              </header>

              <div className="biftu-leaderboard">
                <div className="biftu-leaderboard-hdr">
                  <span>RANK</span>
                  <span>EVALUATION MODEL / ENGINE</span>
                  <span>PASS RATE</span>
                  <span>95% CONFIDENCE INTERVAL</span>
                </div>
                {WORKFLOWBENCH_LEADERBOARD.map((item) => (
                  <div key={item.rank} className={`biftu-leaderboard-row ${item.rank === 1 ? "top-rank" : ""}`}>
                    <span className="biftu-rnk">{item.rank}</span>
                    <strong>{item.name}</strong>
                    <span className="biftu-score">{item.passRate}%</span>
                    <span className="biftu-ci">[{item.confidenceInterval[0]}, {item.confidenceInterval[1]}]</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* About Screen */}
        {activeScreen === "about" && (
          <section className="biftu-sec">
            <div className="biftu-wrap">
              <header className="biftu-sec-hdr">
                <h2>Autonomous agents engineered for mission-critical business workflows</h2>
                <p>Founded by Cybersecurity and Cloud Systems specialists, Biftu designs, benchmarks, and deploys production-grade AI agents, omnichannel lead pipelines, and enterprise automation infrastructure.</p>
              </header>

              <div className="biftu-metrics-grid">
                {ABOUT_METRICS.map((m, idx) => (
                  <div key={idx} className="biftu-box">
                    <span className="biftu-mono-lab">{m.label}</span>
                    <div className="biftu-metric-val">{m.value}</div>
                    <p>{m.caption}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Careers Screen */}
        {activeScreen === "careers" && (
          <section className="biftu-sec">
            <div className="biftu-wrap">
              <header className="biftu-sec-hdr">
                <h2>Join Biftu · Build Autonomous Business Workflows</h2>
                <p>We are hiring engineers and automation architects who want to build high-leverage AI agent infrastructure for global commerce.</p>
              </header>

              <div className="biftu-roles-list">
                {BIFTU_OPEN_ROLES.map((role) => (
                  <div key={role.id} className="biftu-box biftu-role-card">
                    <div>
                      <span className="biftu-mono-lab">{role.team} · {role.location}</span>
                      <h3>{role.title}</h3>
                      <p>{role.description}</p>
                    </div>
                    <a href="mailto:careers@biftu.com" className="biftu-btn biftu-btn-fill">
                      Apply Now
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="biftu-ftr">
        <div className="biftu-wrap biftu-ftr-inner">
          <span className="biftu-mono-lab">© 2026 BIFTU AUTOMATIONS INC.</span>
          <a href="mailto:team@biftu.com" className="biftu-mono-lab">team@biftu.com</a>
        </div>
      </footer>
    </div>
  );
};

export default BiftuView;
