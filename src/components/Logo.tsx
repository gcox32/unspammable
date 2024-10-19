"use client";

import React from "react";

interface LogoProps {
  width?: number;
  height?: number;
  color?: string;
  strokeColor?: string;
}

export default function Logo({ width = 50, height = 50, color = "lightgray", strokeColor = "gray" }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 100 100"
    >
      <circle cx="50" cy="50" r="40" stroke={strokeColor} strokeWidth="5" fill={color} />
    </svg>
  );
}
