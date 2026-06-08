"use client";

import React from "react";

interface Props {
  destination?: string;
  className?: string;
  label?: string;
}

export default function OpenChatButton({ destination, className, label = "Book a Trip" }: Props) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-chat", { detail: { destination } }));
  };

  return (
    <button onClick={handleClick} className={className}>
      {label}
    </button>
  );
}
