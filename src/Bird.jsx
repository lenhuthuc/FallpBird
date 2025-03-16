import React, { useState, useEffect } from "react";

function Bird({ BirdRef, pause }) {
  const [positionY, setPositionY] = useState(window.innerHeight / 2);
  const [positionX, setPositionX] = useState(window.innerWidth / 2);
  const [birdPos, setBirdPos] = useState(true); // true: rơi xuống, false: bay lên
  const gravity = 17;
  const jumpHeight = 100;

  useEffect(() => {
    if (pause) return; // Dừng lại nếu pause là true

    const interval = setInterval(() => {
      if (pause) return;
      setBirdPos(true); // Khi không có input -> Chim rơi xuống
      setPositionY((prev) => Math.min(prev + gravity, window.innerHeight));
    }, 50);

    return () => clearInterval(interval);
  }, [pause]);

  const handleJump = () => {
    if (pause) return;
    setBirdPos(false); // Chim xoay lên khi nhảy
    setPositionY((prev) => Math.max(prev - jumpHeight, 0));
  };

  useEffect(() => {
    if (pause) return;

    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        handleJump();
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === "Space") {
        setBirdPos(true); // Khi thả phím -> Chim quay xuống
      }
    };

    const handleClick = () => {
      if (!pause) {
        handleJump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("click", handleJump);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("click", handleJump);
    };
  }, [pause]);

  return (
    <div
      ref={BirdRef}
      className="flex justify-center items-center absolute text-7xl z-[100] select-none"
      style={{
        top: `${positionY}px`,
        left: `${positionX}px`,
        transform: "translate(-50%, -50%)",
        transition: "top 0.1s ease-out",
      }}
    >
      <span className={`inline-block transition-transform duration-300 ${birdPos ? "rotate-0" : "rotate-180"}`}>
        🐧
      </span>
    </div>
  );
}

export default Bird;
