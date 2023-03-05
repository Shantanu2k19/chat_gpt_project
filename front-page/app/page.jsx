import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <AboutSectionTwo />
      <Testimonials />
    </>
  );
}
