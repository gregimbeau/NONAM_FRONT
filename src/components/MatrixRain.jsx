import React, { useEffect, useRef } from "react";
import "../css/MatrixRain.css";

const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
    const latin = katakana.split("");

    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const rainDrops = [];

    for (let x = 0; x < columns; x++) {
      rainDrops[x] = 1;
    }

    const draw = () => {
      context.fillStyle = "rgba(0, 0, 0, 0.05)";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = "#0F0";
      context.font = fontSize + "px monospace";

      for (let i = 0; i < rainDrops.length; i++) {
        const text = latin[Math.floor(Math.random() * latin.length)];
        context.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }

      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return <canvas ref={canvasRef} className='matrix-rain-container'></canvas>;
};

export default MatrixRain;
