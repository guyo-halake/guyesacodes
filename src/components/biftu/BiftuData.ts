import { AgentRelease, AgentCard, BenchmarkModel, MetricFact, OpenRole } from "./types";

export const BIFTU_RELEASES: AgentRelease[] = [
  {
    version: "v1.3",
    name: "Jobs applications and tracker agent",
    date: "Nov 2026",
    isNew: true
  },
  {
    version: "v1.2",
    name: "45 tasks, 34 workflows",
    date: "Nov 2026"
  },
  {
    version: "v1.1",
    name: "11 WhatsApp Leads agent - Odin",
    date: "Oct 2026"
  }
];

export const BIFTU_AGENT_CARDS: AgentCard[] = [
  {
    id: "odin-commerce",
    number: "01",
    title: "Conversational Commerce & Sales Agent (Odin)",
    description: "24/7 lead qualification, multi-tenant Supabase catalog search, dynamic inventory queries, and automated M-Pesa STK push in WhatsApp.",
    youGet: "a production-ready WhatsApp sales agent with catalog & payment integrations",
    category: "Commerce",
    features: [
      "Multi-tenant catalog resolution in Supabase",
      "Automated M-Pesa Daraja STK Push & Paystack checkout",
      "Real-time stock checking and cart calculations",
      "Human-in-the-loop escalation with sentiment detection"
    ]
  },
  {
    id: "omnichannel-leads",
    number: "02",
    title: "Omnichannel Customer Leads Agent",
    description: "Unified inbound lead ingestion across WhatsApp Cloud API, Telegram bots, SMS, and emails with smart qualification and automated booking.",
    youGet: "an omnichannel agent capturing leads across every customer touchpoint",
    category: "Leads",
    features: [
      "WhatsApp, Telegram, and Africa's Talking SMS gateways",
      "Automated inbound email triage & calendar scheduling",
      "Lead scoring, intent classification, and instant CRM routing",
      "Multi-language & dialect support (English, Swahili, Sheng)"
    ]
  },
  {
    id: "embedded-mcps",
    number: "03",
    title: "Embedded MCPs for Office, Sheets & CRMs",
    description: "Model Context Protocol (MCP) agents embedded natively into Google Sheets, MS Office, HubSpot, and custom databases for bidirectional tool execution.",
    youGet: "live bidirectional AI tools inside your daily spreadsheet and office tools",
    category: "Tools",
    features: [
      "Real-time bidirectional Google Sheets data sync",
      "Automated document generation and invoice compilation in MS Office",
      "HubSpot, Salesforce, and custom CRM API tool-calling",
      "Zero-copy secure local context retrieval"
    ]
  },
  {
    id: "cloud-devops",
    number: "04",
    title: "Cloud & DevOps Autonomous Infrastructure Agent",
    description: "Automated CI/CD pipelines, Azure App Service supervision, PM2 process management, and live webhook diagnostics.",
    youGet: "an autonomous DevOps engineer managing and monitoring your cloud cluster",
    category: "Infrastructure",
    isNew: true,
    features: [
      "Azure App Service and containerized cluster orchestration",
      "Supervisor daemon with automated crash recovery & self-healing",
      "HMAC webhook verification and cryptographic request signing",
      "Live latency monitoring, log diagnostics, and uptime alerts"
    ]
  },
  {
    id: "multi-tenant-platform",
    number: "05",
    title: "Enterprise Multi-Tenant Agent Architecture",
    description: "Complete tenant data isolation with PostgreSQL Row-Level Security (RLS), custom branded portals, and dedicated model weights.",
    youGet: "a multi-tenant agent platform running on private enterprise cloud infrastructure",
    category: "Platform",
    features: [
      "PostgreSQL Row-Level Security (RLS) data isolation",
      "Self-service client dashboard and custom agent personality tuning",
      "Isolated tenant billing, subscription quotas, and rate limiting",
      "Runs on your private Azure or self-hosted VPC, you own the data"
    ]
  },
  {
    id: "rag-copilot",
    number: "06",
    title: "Enterprise RAG & 9PM Executive Copilot",
    description: "Vector search over enterprise SOPs and policies, paired with nightly 9:00 PM automated financial intelligence digests on Telegram.",
    youGet: "zero-hallucination knowledge retrieval + automated executive KPI reporting",
    category: "Intelligence",
    features: [
      "Zero-hallucination vector RAG over company policies and spec sheets",
      "Nightly 9:00 PM executive digest with revenue, leads, and churn KPIs",
      "Proactive abandoned payment recovery campaigns",
      "Automated reconciliation between M-Pesa, Paystack, and bank statements"
    ]
  }
];

export const WORKFLOWBENCH_LEADERBOARD: BenchmarkModel[] = [
  { rank: 1, name: "Biftu Odin Engine (Gemini 2.0 + n8n)", passRate: 98.4, confidenceInterval: [95, 100] },
  { rank: 2, name: "Claude 3.5 Sonnet (ReAct Tool Call)", passRate: 84.2, confidenceInterval: [78, 90] },
  { rank: 3, name: "GPT-4o (Function Calling)", passRate: 79.5, confidenceInterval: [72, 86] },
  { rank: 4, name: "Llama 3.3 70B (Self-Hosted)", passRate: 68.1, confidenceInterval: [59, 76] },
  { rank: 5, name: "DeepSeek V3 (Tool Calling)", passRate: 64.5, confidenceInterval: [55, 73] },
  { rank: 6, name: "Mistral Large 2 (ReAct Agent)", passRate: 58.0, confidenceInterval: [48, 68] },
  { rank: 7, name: "Base Frontier Models (No Biftu Guardrails)", passRate: 34.0, confidenceInterval: [25, 42] }
];

export const ABOUT_METRICS: MetricFact[] = [
  { label: "Domain Engineers", value: "24+", caption: "Active automation specialists & cloud engineers" },
  { label: "Execution SLA", value: "99.9%", caption: "Guaranteed webhook & task delivery uptime" },
  { label: "Response Latency", value: "< 850ms", caption: "Sub-second multi-turn tool calling" },
  { label: "RAG Precision", value: "99.8%", caption: "Zero-hallucination verified policy grounding" }
];

export const BIFTU_OPEN_ROLES: OpenRole[] = [
  {
    id: "agent-eng-01",
    title: "Senior AI Automation Engineer (n8n & Node.js)",
    description: "Architect and scale multi-turn autonomous agent pipelines, tool-calling nodes, and webhook gateways.",
    location: "Remote / Hybrid",
    team: "Agent Core",
    type: "Full-time"
  },
  {
    id: "agent-eng-02",
    title: "Full-Stack Platform Engineer (React, TypeScript & Supabase)",
    description: "Build high-performance client dashboards, real-time analytics views, and embedded MCP UI components.",
    location: "Remote",
    team: "Platform",
    type: "Full-time"
  },
  {
    id: "agent-eng-03",
    title: "Cloud & DevOps Security Engineer (Azure & Zero-Trust)",
    description: "Harden CI/CD deployment pipelines, manage container clusters, and enforce HMAC webhook verification.",
    location: "Remote",
    team: "Security & Infra",
    type: "Full-time"
  }
];
