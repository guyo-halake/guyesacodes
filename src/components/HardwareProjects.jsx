import React, { useState } from "react";
import "../styles/Projects.css";
import "../styles/HardwareProjects.css";
import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";
import FadeInSection from "./FadeInSection";

const hardwareItems = [
  {
    title: "Bare Metal Linux Home Lab",
    subtitle: "24/7 Server · Infrastructure & Automation",
    image: "/assets/hardware/pc/images/header.png",
    lead: "A dedicated, low-power Lenovo Mini PC running bare-metal Ubuntu Server to host private microservices, local storage, and automated network operations.",
    more: [
      "Container Runtime: Docker engine hosting self-contained microservices, local tools, and automation runtimes.",
      "Network & DNS: Pi-hole deployment providing network-wide tracker/ad blocking and private split-horizon DNS resolution.",
      "Zero-Trust Remote Access: Tailscale mesh VPN delivering secure, encrypted access from anywhere without open public ports.",
      "Media & Storage: Jellyfin media server and centralized network storage handling local streaming and file workflows.",
    ],
    techStack: [
      "Lenovo Mini PC",
      "16 GB RAM",
      "1 TB SSD",
      "Ubuntu Server",
      "Docker",
      "Pi-hole",
      "Tailscale",
      "Jellyfin",
    ],
  },
  {
    title: "Custom PC Workstation",
    subtitle: "Primary Engineering & Compute Rig",
    image: "/assets/hardware/pc/images/cover.png",
    lead: "High-performance custom-built desktop workstation engineered for intensive engineering workflows, local container builds, compilation, and multitasking.",
    more: [
      "Processor: AMD Ryzen 7 5700 multi-core processor for fast compilation, virtualization, and multitasking.",
      "Graphics: NVIDIA GeForce RTX (8 GB GDDR6) for GPU-accelerated computing and display pipelines.",
      "Storage & Power: 1 TB PCIe Gen4 NVMe SSD for fast I/O throughput, powered by a Deepcool PL750D PSU.",
      "OS & Platform: Windows 11 Pro configured with WSL2 (Ubuntu) for seamless cross-platform engineering.",
    ],
    techStack: [
      "AMD Ryzen 5700",
      "NVIDIA RTX 8GB",
      "16 GB DDR4",
      "1 TB Gen4 NVMe",
      "Deepcool PL750D",
      "Windows 11",
    ],
  },
  {
    title: "Smart Ambient ESP32 Display",
    subtitle: "Custom IoT Matrix & Lab Telemetry",
    image: "/assets/hardware/led-bracelet/header.jpg",
    lead: "Custom-built physical desktop display powered by an ESP32 microcontroller driving an RGB HUB75 LED matrix panel, bridging the physical desk environment to the home network.",
    more: [
      "Network Clock: High-precision ambient clock synchronized continuously over local Wi-Fi via NTP.",
      "Guest QR Onboarding: Renders an on-screen QR code allowing visitors to instantly scan and connect to local guest Wi-Fi.",
      "Live Server Telemetry: Polls the Lenovo home server over local Wi-Fi to display real-time server vitals, active Docker container counts, and uptime status.",
    ],
    techStack: [
      "ESP32",
      "HUB75 RGB Matrix",
      "C++ / Arduino",
      "Wi-Fi & Bluetooth",
      "NTP Sync",
      "Home Lab API",
    ],
  },
];

const HardwareProjects = () => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (idx) => {
    setExpanded((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div id="hardware-projects">
      <FadeInSection>
        <div className="section-header">
          <span className="section-title">/ hardware</span>
        </div>

        <div className="projects-grid-3">
          {hardwareItems.map((item, idx) => {
            const isExpanded = !!expanded[idx];
            return (
              <FadeInSection key={idx} delay={(idx + 1) * 100 + "ms"}>
                <div className="project-grid-card">
                  {/* Card Header */}
                  <div className="project-card-top">
                    <div className="project-folder-icon">
                      <MemoryRoundedIcon sx={{ fontSize: 32, color: "var(--green-bright)" }} />
                    </div>
                  </div>

                  {/* Image */}
                  <div className="project-card-image-box">
                    <img src={item.image} alt={item.title} />
                  </div>

                  {/* Title & Subtitle */}
                  <div className="project-card-heading">
                    <h3 className="project-card-title">{item.title}</h3>
                    <div className="project-card-subtitle">{item.subtitle}</div>
                  </div>

                  {/* Body Content */}
                  <div className="project-card-body">
                    <p className="project-lead-text">{item.lead}</p>

                    {isExpanded && (
                      <div className="project-expanded-text">
                        {item.more.map((paragraph, pIdx) => (
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

                  {/* Tech / Specs at bottom */}
                  <div className="project-card-tech">
                    {item.techStack.map((tech, tIdx) => (
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

export default HardwareProjects;
