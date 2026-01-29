import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ParticleBackground } from "@/components/ui/ParticleBackground";

interface LayoutProps {
  children: ReactNode;
  showParticles?: boolean;
}

export function Layout({ children, showParticles = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-hero">
      {showParticles && <ParticleBackground />}
      <Navbar />
      <main className="flex-1 pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
}
