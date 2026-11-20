import React, { useState } from "react";
import "../styles/LiveTerminal.css";
import { usePortfolio } from "../context/PortfolioContext";

const LiveTerminal = () => {
  const { telemetry } = usePortfolio();
  const [history, setHistory] = useState([
    {
      type: "system",
      text: "⚡ Guyo Halake Cloud & Agent Interactive Console [v2.4.0]\nType 'help' to inspect live cloud telemetry, agent stacks, or security audits.",
    },
  ]);
  const [inputVal, setInputVal] = useState("");

  const handleCommand = (e) => {
    if (e.key !== "Enter") return;
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    let response = "";
    if (cmd === "help") {
      response = `Available Commands:
  • status    - Query live Azure & Edge homelab telemetry
  • agents    - Inspect active MCP servers & tool-calling pipelines
  • security  - Check zero-trust networking & RBAC posture
  • projects  - List verified production deployments & legal SaaS
  • contact   - Direct channels to reach Guyo Halake
  • clear     - Reset terminal screen`;
    } else if (cmd === "status") {
      response = `[CLOUD INFRASTRUCTURE]
  Provider:      ${telemetry?.cloud?.provider || "Microsoft Azure"}
  Service:       ${telemetry?.cloud?.service || "Azure App Service (Linux B1)"}
  Availability:  ${telemetry?.cloud?.uptime || "99.98%"}
  Edge Node:     ${telemetry?.homelab?.server || "Ubuntu Server (Lenovo Mini)"}
  Mesh Network:  ${telemetry?.homelab?.tailscale || "Tailscale Zero-Trust WireGuard"}
  DNS Status:    ${telemetry?.homelab?.dns || "Pi-hole Resolving"}`;
    } else if (cmd === "agents") {
      response = `[AUTONOMOUS AI ORCHESTRATION]
  LLM Engines:   Google Gemini 1.5 Flash + Claude 3.5 Sonnet
  Architecture:  Model Context Protocol (MCP) + Hybrid RAG
  MCP Servers:   6 Connected (n8n, Instagram, TikTok, Sheets, Supabase, Daraja)
  Fintech Hook:  Real-time Safaricom Daraja M-Pesa STK Push Integration
  WhatsApp:      Production WAHA / Meta Cloud API Gateway`;
    } else if (cmd === "security") {
      response = `[ENTERPRISE CLOUD SECURITY]
  Access Model:  Zero-Trust Architecture via Tailscale VPN
  Container:     Hardened Alpine Linux (<40MB footprint)
  Isolation:     Supabase PostgreSQL Row Level Security (RLS)
  Encryption:    TLS 1.3 / Strict HTTPS / HSTS Enforced`;
    } else if (cmd === "projects") {
      response = `[VERIFIED PRODUCTION SYSTEMS]
  1. Nyagah B. Kithinji Advocates - Bill of Costs Legal-Tech SaaS (FastAPI + React 18)
  2. Odin Multi-Tenant AI Platform - 6 MCP Servers + WhatsApp + M-Pesa Payments
  3. Azure Cloud & DevOps Automation Lab - CI/CD + OpenClaw + Linux telemetry`;
    } else if (cmd === "contact") {
      response = `[COMMUNICATION CHANNELS]
  Email:    guyohalakeofficial@gmail.com
  GitHub:   https://github.com/guyo-halake
  LinkedIn: https://www.linkedin.com/in/guyo-halake/
  Location: Nairobi, Kenya (Global Remote Ready)`;
    } else if (cmd === "clear") {
      setHistory([]);
      setInputVal("");
      return;
    } else {
      response = `Command '${cmd}' not recognized. Type 'help' to see available commands.`;
    }

    setHistory((prev) => [
      ...prev,
      { type: "user", text: `guyo@azure-cloud:~$ ${inputVal}` },
      { type: "system", text: response },
    ]);
    setInputVal("");
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <div className="terminal-title">guyo-agent-node: azure-eastus ~ bash</div>
        <div className="terminal-badge">LIVE CLOUD TELEMETRY</div>
      </div>
      <div className="terminal-body">
        {history.map((item, idx) => (
          <div key={idx} className={`terminal-line ${item.type}`}>
            <pre>{item.text}</pre>
          </div>
        ))}
        <div className="terminal-prompt-row">
          <span className="terminal-prompt">guyo@azure-cloud:~$</span>
          <input
            type="text"
            className="terminal-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleCommand}
            placeholder="try 'status', 'agents', or 'help'..."
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};

export default LiveTerminal;
