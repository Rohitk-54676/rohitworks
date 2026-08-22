import { Code2, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

import { useSiteSettings } from "../../hooks/useSiteSettings";
import { RevealGroup, RevealItem } from "../../lib/motion";

const About = () => {
  const { data: settings, isLoading } = useSiteSettings();

  if (isLoading) {
    return (
      <section id="about" className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="h-8 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-4">
              <div className="h-6 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-6 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <RevealGroup className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]" stagger={0.1}>
          {/* Section heading */}
          <RevealItem>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              About Me
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              Building through projects, not just tutorials.
            </h2>
          </RevealItem>

          {/* Content */}
          <RevealItem>
            <p className="text-lg leading-8 text-slate-600 dark:text-slate-400">
              I&apos;m a Computer Science and Engineering student focused on
              becoming a stronger full-stack developer. My approach to
              learning is simple: understand the fundamentals, build real
              projects, encounter problems, and solve them.
            </p>

            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
              Through hands-on projects, I&apos;ve worked with frontend
              development, backend APIs, authentication, databases, and
              deployment. I primarily work with technologies such as React,
              TypeScript, JavaScript, Node.js, Express, and PostgreSQL.
            </p>

            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mt-8 border-l-2 border-[var(--accent)] pl-5"
            >
              <div className="flex items-center gap-2">
                <Code2 size={17} className="text-[var(--accent)]" />
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  My Approach
                </p>
              </div>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-300">
                I&apos;m interested in building practical software that
                solves real problems while continuously improving my
                understanding of backend development, application
                architecture, and system design.
              </p>
            </motion.div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              {settings?.location && (
                <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin size={17} />
                  <span>{settings.location}</span>
                </div>
              )}

              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                >
                  <Mail size={17} />
                  <span>{settings.email}</span>
                </a>
              )}
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
};

export default About;
