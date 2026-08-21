import {
  Award,
  ExternalLink,
  FileBadge,
} from "lucide-react";

import { useCertifications } from "../../hooks/useCertifications";

const formatDate = (
  date: string | null | undefined
) => {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

const Certifications = () => {
  const {
    data: certifications,
    isLoading,
    isError,
  } = useCertifications();

  if (isLoading) {
    return (
      <section
        id="certifications"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

          <div className="mt-4 h-10 w-80 animate-pulse rounded bg-slate-200" />

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse border border-slate-200 bg-slate-100"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section
        id="certifications"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="text-sm text-slate-500">
            Certifications could not be loaded right now.
          </p>
        </div>
      </section>
    );
  }

  const sortedCertifications = Array.isArray(certifications)
    ? [...certifications].sort(
        (a, b) =>
          (a.display_order ?? 0) -
          (b.display_order ?? 0)
      )
    : [];

  if (sortedCertifications.length === 0) {
    return (
      <section
        id="certifications"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Certifications
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Verified learning and credentials.
          </h2>

          <p className="mt-10 text-slate-500">
            Certification entries have not been added yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="certifications"
      className="border-b border-slate-200"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Certifications
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Verified learning and credentials.
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Certifications and credentials representing structured learning
            and continued professional development.
          </p>
        </div>

        {/* Certification cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedCertifications.map((certification) => {
            const issueDate = formatDate(
              certification.issue_date
            );

            return (
              <article
                key={certification.id}
                className="group overflow-hidden border border-slate-200 bg-white transition-colors hover:border-slate-950"
              >
                {/* Certificate image */}
                {certification.certificate_image_url ? (
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={certification.certificate_image_url}
                      alt={certification.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center bg-slate-100">
                    <Award
                      size={40}
                      className="text-slate-400"
                    />
                  </div>
                )}

                <div className="p-6">
                  {certification.issuing_organization && (
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {certification.issuing_organization}
                    </p>
                  )}

                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                    {certification.title}
                  </h3>

                  {issueDate && (
                    <p className="mt-3 text-sm text-slate-500">
                      Issued {issueDate}
                    </p>
                  )}

                  {certification.credential_id && (
                    <div className="mt-5 flex items-start gap-2 text-sm text-slate-600">
                      <FileBadge
                        size={16}
                        className="mt-0.5 shrink-0"
                      />

                      <span>
                        Credential ID:{" "}
                        {certification.credential_id}
                      </span>
                    </div>
                  )}

                  {certification.credential_url && (
                    <a
                      href={certification.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
                    >
                      Verify Credential
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Certifications;