import { useState } from "react";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Send,
} from "lucide-react";

import { useSiteSettings } from "../../hooks/useSiteSettings";
import { useContact } from "../../hooks/useContact";

const Contact = () => {
  const {
    data: settings,
    isLoading,
  } = useSiteSettings();

  const {
    mutate: sendMessage,
    isPending,
  } = useContact();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    sendMessage(formData, {
      onSuccess: () => {
        setSuccessMessage(
          "Your message has been sent successfully. I'll get back to you as soon as possible."
        );

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
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
      <section
        id="contact"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-5">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

              <div className="h-12 w-full animate-pulse rounded bg-slate-200" />

              <div className="h-20 w-full animate-pulse rounded bg-slate-200" />
            </div>

            <div className="space-y-4">
              <div className="h-12 animate-pulse rounded bg-slate-200" />
              <div className="h-12 animate-pulse rounded bg-slate-200" />
              <div className="h-12 animate-pulse rounded bg-slate-200" />
              <div className="h-32 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="contact"
      className="border-b border-slate-200"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Contact information */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Contact
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Let&apos;s build something useful.
            </h2>

            <p className="mt-6 max-w-md text-base leading-8 text-slate-600">
              Have a project, opportunity, collaboration, or
              idea you&apos;d like to discuss? Send me a
              message.
            </p>

            <div className="mt-10 space-y-4">
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="group flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-slate-950"
                >
                  <span className="flex h-10 w-10 items-center justify-center border border-slate-200 transition-colors group-hover:border-slate-950">
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
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="flex h-10 w-10 items-center justify-center border border-slate-200">
                    <MapPin size={18} />
                  </span>

                  <span>{settings.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact form */}
          <div className="border border-slate-200 bg-white p-6 sm:p-8">
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-slate-700"
                  >
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
                    className="mt-2 w-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700"
                  >
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
                    className="mt-2 w-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="text-sm font-medium text-slate-700"
                >
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
                  className="mt-2 w-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-slate-700"
                >
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
                  className="mt-2 w-full resize-y border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Error */}
              {errorMessage && (
                <p className="text-sm text-red-600">
                  {errorMessage}
                </p>
              )}

              {/* Success */}
              {successMessage && (
                <p className="text-sm text-green-600">
                  {successMessage}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 bg-slate-950 px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={17} />

                {isPending
                  ? "Sending..."
                  : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;