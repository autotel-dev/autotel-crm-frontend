import toast, { Toaster } from "react-hot-toast";
import React from "react";
import { createRoot } from "react-dom/client";
import { CheckCircle2, XCircle } from "lucide-react"; // icons

// 🔊 Voice announcement
const speakAlert = (message) => {
  if ("speechSynthesis" in window && message) {
    const utterance = new SpeechSynthesisUtterance(message);
    const femaleVoice = window.speechSynthesis
      .getVoices()
      .find((v) => v.name.toLowerCase().includes("female"));
    utterance.voice = femaleVoice || null;
    utterance.pitch = 1;
    utterance.rate = 1;
    window.speechSynthesis.cancel(); // stop any previous speech
    window.speechSynthesis.speak(utterance);
  }
};

// ✅ Glassmorphism Toast Component
const GlassToast = ({ title, text, icon }) => {
  const isOn = icon === "IGNITION_ON";

  const color = isOn ? "#4ade80" : "#f87171"; // green / red
  const Icon = isOn ? CheckCircle2 : XCircle;

  return (
    <div
      className="animate-slideInRight"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "14px 20px",
        borderRadius: "16px",
        color,
        fontSize: "15px",
        fontWeight: 400,
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 25px rgba(0, 0, 0, 0.4)",
        border: `3px solid ${color}`,
        background: "black", // 🔳 light black overlay
        minWidth: "260px",
        maxWidth: "340px",
        transition: "all 0.3s ease",
      }}
    >
      {/* <Icon size={24} strokeWidth={2.2} color={color} /> */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {title && (
          <span
            style={{
              fontSize: "18px", // title 3px larger
              fontWeight: "bold",
              lineHeight: "1.2",
              color,
              fontWeight: "bold",
            }}
          >
            {title}
          </span>
        )}
        {text && (
          <div style={{ fontSize: "14px", lineHeight: "1.4", color }}>
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ Toast Function (Ignition ON/OFF)
const Toast = ({
  title = "",
  text = "",
  icon,
  duration = 3000,
  position = "top-right",
}) => {
  const voiceMessage = `${title ? title + ". " : ""}${text}`;
  if (voiceMessage) speakAlert(voiceMessage);

  toast.custom(() => <GlassToast title={title} text={text} icon={icon} />, {
    duration,
    position,
  });
};

// ✅ Initialize global Toaster only once
if (typeof window !== "undefined" && !window.__toast_initialized) {
  const toastDiv = document.createElement("div");
  document.body.appendChild(toastDiv);
  createRoot(toastDiv).render(<Toaster position="top-right" />);
  window.__toast_initialized = true;
}

// ✅ Inject animation
if (
  typeof document !== "undefined" &&
  !document.getElementById("toast-animation-style")
) {
  const style = document.createElement("style");
  style.id = "toast-animation-style";
  style.innerHTML = `
    @keyframes slideInRight {
      0% { opacity: 0; transform: translateX(100%); }
      60% { opacity: 1; transform: translateX(-10%); }
      100% { transform: translateX(0); }
    }
    .animate-slideInRight {
      animation: slideInRight 0.5s cubic-bezier(0.25, 1, 0.5, 1);
    }
  `;
  document.head.appendChild(style);
}

export default Toast;
