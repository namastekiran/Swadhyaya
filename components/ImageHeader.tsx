"use client";

import React from "react";

interface ImageHeaderProps {
  imageUrl: string;
  overlay: string; // CSS gradient string
  height?: number;
  children: React.ReactNode;
  padding?: string;
}

export function ImageHeader({ imageUrl, overlay, height = 130, children, padding = "20px 20px 22px" }: ImageHeaderProps) {
  return (
    <div
      style={{
        minHeight: height,
        padding,
        display: "flex",
        flexDirection: "column",
        backgroundImage: `${overlay}, url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {children}
    </div>
  );
}
