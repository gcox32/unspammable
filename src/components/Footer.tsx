"use client";

import React from "react";
import '@/src/styles/components/Footer.css';

export default function Footer() {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} unspammable</p>
    </footer>
  );
}
