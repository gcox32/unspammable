"use client"

import Navigation from "@/src/components/Navigation";
import Footer from "@/src/components/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
} 