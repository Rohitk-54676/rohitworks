import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/public/Navbar";
import Hero from "../../components/public/Hero";
import About from "../../components/public/About";
import Skills from "../../components/public/Skills";
import Projects from "../../components/public/Projects";
import DevelopmentPresence from "../../components/public/DevelopmentPresence";
import Experience from "../../components/public/Experience";
import Education from "../../components/public/Education";
import Achievements from "../../components/public/Achievements";
import Certifications from "../../components/public/Certifications";
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
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <About />

        <Skills />

        <Projects />

        <DevelopmentPresence />

        <Experience />

        <Education />

        <Achievements />

        <Certifications />

        <Contact />
      </main>

      <Footer />
    </>
  );
};

export default HomePage;