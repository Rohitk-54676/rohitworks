import { Mail, MapPin } from "lucide-react";

import { useSiteSettings } from "../../hooks/useSiteSettings";

const About = () => {
  const {
    data: settings,
    isLoading,
  } = useSiteSettings();

  if (isLoading) {
    return (
      <section
        id="about"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />

            <div className="space-y-4">
              <div className="h-6 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-6 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="about"
      className="border-b border-slate-200"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          {/* Section heading */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              About Me
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              A developer focused on building practical, real-world software.
            </h2>
          </div>

          {/* Content */}
          <div>
            {settings?.bio ? (
              <p className="text-lg leading-8 text-slate-600">
                {settings.bio}
              </p>
            ) : (
              <p className="text-lg leading-8 text-slate-600">
                I focus on learning by building projects, improving my
                technical skills, and turning ideas into practical software.
              </p>
            )}

            {settings?.current_focus && (
              <div className="mt-8 border-l-2 border-slate-950 pl-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Current Focus
                </p>

                <p className="mt-2 text-base leading-7 text-slate-700">
                  {settings.current_focus}
                </p>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              {settings?.location && (
                <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <MapPin size={17} />
                  <span>{settings.location}</span>
                </div>
              )}

              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-950"
                >
                  <Mail size={17} />
                  <span>{settings.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;