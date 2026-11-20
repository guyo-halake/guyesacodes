import React from "react";
import "../styles/Intro.css";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
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
          <span className="intro-name">Guyo Halake</span>
          <span className="intro-cursor">.</span>
        </div>

        <div
          className="intro-role-badge"
          contentEditable={isEditMode}
          suppressContentEditableWarning={true}
          onBlur={(e) => updateProfileField("headline", e.currentTarget.textContent)}
          title={isEditMode ? "Click to edit professional headline" : undefined}
        >
          {profile.headline || "Software Engineer"}
        </div>

        <FadeInSection>
          <div
            className="intro-desc"
            contentEditable={isEditMode}
            suppressContentEditableWarning={true}
            onBlur={(e) => updateProfileField("introDesc", e.currentTarget.textContent)}
            title={isEditMode ? "Click to edit intro text" : undefined}
          >
            {profile.introDesc ||
              "I'm a software engineer in Nairobi, Kenya. I build smart agentic models and automations, and do AWS cloud security. Occasionally both happen at the same time."}
          </div>

          <div className="intro-actions-row">
            <a href={`mailto:${profile.email || "guyohalakeofficial@gmail.com"}`} className="intro-contact">
              <EmailRoundedIcon sx={{ fontSize: 18 }} />
              <span>Say Hi</span>
            </a>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
};

export default Intro;
