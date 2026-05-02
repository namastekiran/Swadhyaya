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
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
      />
      <div style={{ position: "absolute", inset: 0, background: overlay }} />
      <div style={{ position: "relative", zIndex: 1, padding, minHeight: height }}>
        {children}
      </div>
    </div>
  );
}
