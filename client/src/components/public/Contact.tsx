import { useState } from "react";
import { ArrowUpRight, Mail, MapPin, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useSiteSettings } from "../../hooks/useSiteSettings";
import { useContact } from "../../hooks/useContact";
import { RevealGroup, RevealItem } from "../../lib/motion";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500";

const Contact = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const { mutate: sendMessage, isPending } = useContact();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    sendMessage(formData, {
      onSuccess: () => {
        setSuccessMessage(
          "Your message has been sent successfully. I'll get back to you as soon as possible."
        );
        setFormData({ name: "", email: "", subject: "", message: "" });
      },
      onError: () => {
        setErrorMessage(
          "Something went wrong while sending your message. Please try again."
        );
      },
    });
  };

  if (isLoading) {
    return (
      <section id="contact" className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-5">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-12 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-20 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="space-y-4">
              <div className="h-12 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-12 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-12 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <RevealGroup className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]" stagger={0.1}>
          {/* Contact information */}
          <RevealItem>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Contact
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              Let&apos;s build something useful.
            </h2>

            <p className="mt-6 max-w-md text-base leading-8 text-slate-600 dark:text-slate-400">
              Have a project, opportunity, collaboration, or idea
              you&apos;d like to discuss? Send me a message.
            </p>

            <div className="mt-10 space-y-4">
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="group flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 transition-colors group-hover:border-[var(--accent)] dark:border-slate-700">
                    <Mail size={18} />
                  </span>
                  <span>{settings.email}</span>
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              )}

              {settings?.location && (
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700">
                    <MapPin size={18} />
                  </span>
                  <span>{settings.location}</span>
                </div>
              )}
            </div>
          </RevealItem>

          {/* Contact form */}
          <RevealItem>
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isPending}
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isPending}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={isPending}
                    placeholder="What would you like to discuss?"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isPending}
                    rows={6}
                    placeholder="Write your message here..."
                    className={`${inputClass} resize-y leading-6`}
                  />
                </div>

                <AnimatePresence mode="wait">
                  {errorMessage && (
                    <motion.p
                      key="error"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-red-600 dark:text-red-400"
                    >
                      {errorMessage}
                    </motion.p>
                  )}

                  {successMessage && (
                    <motion.p
                      key="success"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-green-600 dark:text-green-400"
                    >
                      {successMessage}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={17} />
                  {isPending ? "Sending..." : "Send Message"}
                </motion.button>
              </form>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
};

export default Contact;
