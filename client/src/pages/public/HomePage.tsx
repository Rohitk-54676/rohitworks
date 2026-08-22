import { useEffect, useRef } from "react";
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

  const longPressTimer = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  /*
   * Desktop shortcut:
   * Ctrl + Shift + A → Admin dashboard
   */

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

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [navigate]);

  /*
   * Mobile shortcut:
   * Long press anywhere on the navbar for 1 second.
   */

  const handleAdminTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      navigate("/admin");
    }, 1000);
  };

  const handleAdminTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);

      longPressTimer.current = null;
    }
  };

  /*
   * Cleanup timer if component unmounts.
   */

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return (
    <>
      <div
        onTouchStart={handleAdminTouchStart}
        onTouchEnd={handleAdminTouchEnd}
        onTouchCancel={handleAdminTouchEnd}
      >
        <Navbar />
      </div>

      <main>
        <Hero />

        <About />

        <Services />

        <Projects />

        <Skills />

        <DevelopmentPresence />

        <ProfessionalJourney />

        <Contact />
      </main>

      <Footer />
    </>
  );
};

export default HomePage;