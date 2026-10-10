import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import SelectedWork from "@/components/SelectedWork";
import DigitalOOH from "@/components/DigitalOOH";
import Film from "@/components/Film";
import Photography from "@/components/Photography";
import BehindTheScenes from "@/components/BehindTheScenes";
import Experience from "@/components/Experience";
import Capabilities from "@/components/Capabilities";
import Background from "@/components/Background";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <SelectedWork />
        <DigitalOOH />
        <Film />
        <Photography />
        <BehindTheScenes />
        <Experience />
        <Capabilities />
        <Background />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
