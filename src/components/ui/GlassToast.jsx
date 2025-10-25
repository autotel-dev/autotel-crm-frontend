import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const speakAlert = (text) => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice =
      window.speechSynthesis
        .getVoices()
        .find((v) => v.name.toLowerCase().includes("female")) || null;
    utterance.pitch = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  }
};

const GlassToast = ({ show, heading, message, type, onClose }) => {
  useEffect(() => {
    if (show && heading) {
      speakAlert(heading);
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, heading]);

  const isIgnitionOn = type?.toLowerCase() === "ignition_on";
  const borderColor = isIgnitionOn ? "rgba(0,255,0,0.4)" : "rgba(255,0,0,0.4)";
  const bgColor = isIgnitionOn
    ? "rgba(0, 255, 0, 0.08)"
    : "rgba(255, 0, 0, 0.08)";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.4 }}
          className="fixed top-5 right-5 backdrop-blur-md rounded-2xl shadow-lg p-4 text-white"
          style={{
            border: `1.5px solid ${borderColor}`,
            background: `linear-gradient(135deg, ${bgColor}, rgba(255,255,255,0.05))`,
            boxShadow: `0 4px 30px ${
              isIgnitionOn ? "rgba(0,255,0,0.3)" : "rgba(255,0,0,0.3)"
            }`,
            maxWidth: "280px",
            zIndex: 9999,
          }}
        >
          <h3
            style={{
              color: isIgnitionOn ? "#00FF88" : "#FF4D4D",
              fontWeight: "bold",
              marginBottom: "6px",
              fontSize: "16px",
            }}
          >
            {heading}
          </h3>
          <p
            style={{
              color: "white",
              fontSize: "13px",
              lineHeight: "1.4",
            }}
          >
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlassToast;
