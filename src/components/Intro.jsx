import React from "react";
import "../styles/Intro.css";
import { TypeAnimation } from "react-type-animation";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FadeInSection from "./FadeInSection";
import AsciiPortrait from "./AsciiPortrait";
import { usePortfolio } from "../context/PortfolioContext";

const Intro = () => {
  const { profile, isEditMode, updateProfileField } = usePortfolio();

  return (
    <div id="intro">
      <div className="intro-simulation">
        <AsciiPortrait />
      </div>
      <div className="intro-block">
        <div className="intro-title">
          {"hi, "}
          <span className="intro-name">
            <TypeAnimation
              sequence={["guyo"]}
              wrapper="span"
              cursor={false}
              repeat={0}
            />
          </span>
          {" here."}
          <span className="intro-cursor">|</span>
        </div>

        <div
          className="intro-role-badge"
          contentEditable={isEditMode}
          suppressContentEditableWarning={true}
          onBlur={(e) => updateProfileField("headline", e.currentTarget.textContent)}
          title={isEditMode ? "Click to edit professional headline" : undefined}
        >
          {profile.headline || "Guyo Halake · Software & Cloud Developer"}
        </div>

        <FadeInSection>
          <div
            className="intro-desc"
            contentEditable={isEditMode}
            suppressContentEditableWarning={true}
            onBlur={(e) => updateProfileField("introDesc", e.currentTarget.textContent)}
            title={isEditMode ? "Click to edit intro text" : undefined}
          >
            {profile.introDesc}
          </div>

          <div className="intro-actions-row">
            <a href={`mailto:${profile.email}`} className="intro-contact">
              <EmailRoundedIcon sx={{ fontSize: 18 }} />
              <span>Say Hello</span>
            </a>

            <a
              href="https://wa.me/254700000000?text=Hi%20Guyo,%20saw%20your%20portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="intro-contact btn-whatsapp"
              title="Chat directly on WhatsApp"
              onClick={(e) => {
                const phone = window.prompt(
                  "Chat with Guyo on WhatsApp. Enter your number or confirm:",
                  "254"
                );
                if (phone && phone.trim() !== "254") {
                  window.open(
                    `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=Hi%20Guyo,%20saw%20your%20portfolio`,
                    "_blank"
                  );
                }
                e.preventDefault();
              }}
            >
              <WhatsAppIcon sx={{ fontSize: 18 }} />
              <span>WhatsApp</span>
            </a>

            <a href="#projects" className="intro-contact btn-projects">
              <span>View Projects ↓</span>
            </a>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
};

export default Intro;
