import { Code2, Database, Globe, LayoutDashboard, Wrench } from "lucide-react";
import { motion } from "framer-motion";

import { RevealGroup, RevealItem } from "../../lib/motion";

const services = [
  {
    title: "Frontend Development",
    description:
      "Building responsive and modern user interfaces using React, TypeScript, Tailwind CSS, and modern frontend practices.",
    icon: Code2,
  },
  {
    title: "Full Stack Web Development",
    description:
      "Developing complete web applications with frontend interfaces, backend APIs, authentication, databases, and deployment.",
    icon: Globe,
  },
  {
    title: "Backend & API Development",
    description:
      "Creating REST APIs, server-side logic, authentication systems, and integrations using Node.js and Express.",
    icon: Database,
  },
  {
    title: "Portfolio & Personal Websites",
    description:
      "Creating professional portfolio and personal websites focused on performance, responsiveness, and clean presentation.",
    icon: LayoutDashboard,
  },
  {
    title: "Website Improvements",
    description:
      "Improving existing websites by fixing issues, refining UI, adding features, and improving overall usability.",
    icon: Wrench,
  },
];

const Services = () => {
  return (
    <section id="services" className="border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Services
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            How I can help build and improve your ideas.
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
            I build practical web solutions, from responsive interfaces to
            complete full-stack applications and improvements to existing
            projects.
          </p>
        </motion.div>

        {/* Services */}
        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <RevealItem key={service.title}>
                <article className="group h-full rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-950 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-white sm:p-8">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 transition-colors group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)]/10 dark:border-slate-700">
                    <Icon size={21} className="text-[var(--accent)]" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    {service.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                    {service.description}
                  </p>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
};

export default Services;
