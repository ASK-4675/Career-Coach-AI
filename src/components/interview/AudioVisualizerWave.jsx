import React, { useEffect, useRef } from "react";

export const AudioVisualizerWave = ({
  isActive = false,
  isSpeaking = false,
  isListening = false,
  colorScheme = "indigo" // 'indigo' (interviewer) or 'emerald' (candidate voice)
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let step = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const isAnimating = isActive || isSpeaking || isListening;
      const primaryColor =
        colorScheme === "emerald"
          ? isAnimating ? "rgba(16, 185, 129, 0.85)" : "rgba(16, 185, 129, 0.3)"
          : isAnimating ? "rgba(99, 102, 241, 0.85)" : "rgba(99, 102, 241, 0.3)";

      const secondaryColor =
        colorScheme === "emerald"
          ? "rgba(5, 150, 105, 0.4)"
          : "rgba(129, 140, 248, 0.4)";

      const baseAmplitude = isAnimating ? (isSpeaking ? 14 : 10) : 3;
      const speed = isAnimating ? (isSpeaking ? 0.08 : 0.05) : 0.02;

      step += speed;

      // Draw secondary subtle wave
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      for (let x = 0; x < width; x++) {
        const angle = (x / width) * Math.PI * 4 + step * 0.7;
        const y = height / 2 + Math.sin(angle) * (baseAmplitude * 0.6);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw primary dynamic wave
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      for (let x = 0; x < width; x++) {
        const angle = (x / width) * Math.PI * 3 + step;
        const wave = Math.sin(angle) * Math.cos(angle * 0.5);
        const y = height / 2 + wave * baseAmplitude;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.stroke();

      // Ambient dots at peaks when active
      if (isAnimating) {
        for (let i = 0; i < 5; i++) {
          const px = ((step * 15 + i * (width / 5)) % width);
          const py = height / 2 + Math.sin((px / width) * Math.PI * 3 + step) * baseAmplitude;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = primaryColor;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, isSpeaking, isListening, colorScheme]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "40px" }}>
      <canvas
        ref={canvasRef}
        width={320}
        height={40}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
};
