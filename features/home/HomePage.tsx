"use client"

import { CTASection } from "./components/CTASection";
import { ForDesigners } from "./components/ForDesigners";
import { Gallery } from "./components/Gallery";
import Hero from "./components/Hero/Hero";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import { Testimonials } from "./components/Testimonials";

export default function HomePage() {
    return (
      <div>
        <Hero />
        <HowItWorks />
        <Gallery />
        <ForDesigners />
        <Testimonials />
        <CTASection />
      </div>
    );
  }