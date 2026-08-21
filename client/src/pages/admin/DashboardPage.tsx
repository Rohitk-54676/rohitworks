import {
  BriefcaseBusiness,
  FolderKanban,
  Mail,
  Sparkles,
} from "lucide-react";

import { useDashboard } from "../../hooks/useDashboard";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof FolderKanban;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
          <Icon size={20} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-7 w-32 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-xl bg-slate-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-900">
          Unable to load dashboard
        </h2>

        <p className="mt-1 text-sm text-red-700">
          Some portfolio data could not be loaded. Please try again.
        </p>
      </div>
    );
  }

  const unreadMessages = data.messages.filter(
    (message) => !message.is_read,
  ).length;

  const recentMessages = data.messages.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Overview of your portfolio content.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Projects"
          value={data.projects.length}
          icon={FolderKanban}
        />

        <StatCard
          label="Skills"
          value={data.skills.length}
          icon={Sparkles}
        />

        <StatCard
          label="Experience"
          value={data.experience.length}
          icon={BriefcaseBusiness}
        />

        <StatCard
          label="Unread Messages"
          value={unreadMessages}
          icon={Mail}
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Recent Messages
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your latest contact form submissions.
          </p>
        </div>

        {recentMessages.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <Mail
              size={28}
              className="mx-auto text-slate-400"
              strokeWidth={1.5}
            />

            <p className="mt-3 text-sm font-medium text-slate-700">
              No messages yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              New contact submissions will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentMessages.map((message) => (
              <div
                key={message.id}
                className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {message.name}
                    </p>

                    {!message.is_read && (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                        Unread
                      </span>
                    )}
                  </div>

                  <p className="truncate text-sm text-slate-500">
                    {message.subject || "No subject"}
                  </p>
                </div>

                <p className="shrink-0 text-xs text-slate-400">
                  {formatDate(message.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}