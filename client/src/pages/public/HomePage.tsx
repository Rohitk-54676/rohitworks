import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/public/Navbar";
import Hero from "../../components/public/Hero";
import About from "../../components/public/About";
import Projects from "../../components/public/Projects";
import Skills from "../../components/public/Skills";
import DevelopmentPresence from "../../components/public/DevelopmentPresence";

import ProfessionalJourney from "../../components/public/ProfessionalJourney";

import Services from "../../components/public/Services";

import Contact from "../../components/public/Contact";
import Footer from "../../components/public/Footer";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.ctrlKey &&
        event.shiftKey &&
        event.key.toLowerCase() === "a"
      ) {
        event.preventDefault();

        navigate("/admin");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [navigate]);

  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <About />

        <Services />

        <Projects />

        <Skills />

        <DevelopmentPresence />

        {/* Professional Journey with toggle */}
        <ProfessionalJourney />

        <Contact />
      </main>

      <Footer />
    </>
  );
};

export default HomePage;