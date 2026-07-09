import { CTASection } from "./components/CTASection";
import { ForDesigners } from "./components/ForDesigners";
import { Gallery } from "./components/Gallery/Gallery";
import Hero from "./components/Hero/Hero";
import HowItWorks from "./components/HowItWorks/HowItWorks";

export default function HomePage() {
    return (
      <div>
        <Hero />
        <HowItWorks />
        <Gallery />
        <ForDesigners />
        {/* <Testimonials /> */}
        <CTASection />
      </div>
    );
  }