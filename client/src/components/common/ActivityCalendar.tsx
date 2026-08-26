import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

interface ActivityCalendarProps {
  data: Array<{
    date: string;
    count: number;
  }>;
}

const WEEKDAY_LABELS = [
  "",
  "Mon",
  "",
  "Wed",
  "",
  "Fri",
  "",
];

function getIntensity(
  count: number,
  max: number,
): number {
  if (count <= 0 || max <= 0) {
    return 0;
  }

  const ratio = count / max;

  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;

  return 1;
}

const intensityClasses = [
  "bg-slate-100 dark:bg-slate-800",
  "bg-emerald-200 dark:bg-emerald-900",
  "bg-emerald-300 dark:bg-emerald-700",
  "bg-emerald-500 dark:bg-emerald-500",
  "bg-emerald-700 dark:bg-emerald-300",
];

const ActivityCalendar = ({
  data,
}: ActivityCalendarProps) => {
  const currentYear =
    new Date().getFullYear();

  const [selectedYear, setSelectedYear] =
    useState(currentYear);

  const [hovered, setHovered] = useState<{
    date: string;
    count: number;
  } | null>(null);

  const {
    weeks,
    max,
    total,
    monthLabels,
  } = useMemo(() => {
    const byDate = new Map(
      data.map((entry) => [
        entry.date,
        entry.count,
      ]),
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    /*
     * Start at January 1 of selected year.
     */
    const yearStart = new Date(
      selectedYear,
      0,
      1,
    );

    /*
     * If current year, stop at today.
     * If previous year, stop at December 31.
     */
    const yearEnd =
      selectedYear === currentYear
        ? new Date(today)
        : new Date(
            selectedYear,
            11,
            31,
          );

    /*
     * Move start backwards to Sunday
     * for proper week columns.
     */
    const start = new Date(yearStart);

    start.setDate(
      start.getDate() - start.getDay(),
    );

    /*
     * For previous years, complete the
     * last week through Saturday.
     *
     * For current year, do NOT show
     * future dates.
     */
    const end = new Date(yearEnd);

    if (selectedYear !== currentYear) {
      end.setDate(
        end.getDate() +
          (6 - end.getDay()),
      );
    }

    const days: Array<{
      date: string;
      count: number;
      inSelectedYear: boolean;
    }> = [];

    const cursor = new Date(start);

    while (cursor <= end) {
      const date = cursor
        .toISOString()
        .slice(0, 10);

      days.push({
        date,
        count: byDate.get(date) ?? 0,
        inSelectedYear:
          cursor.getFullYear() ===
          selectedYear,
      });

      cursor.setDate(
        cursor.getDate() + 1,
      );
    }

    const weekColumns: Array<
      Array<{
        date: string;
        count: number;
        inSelectedYear: boolean;
      }>
    > = [];

    for (
      let i = 0;
      i < days.length;
      i += 7
    ) {
      weekColumns.push(
        days.slice(i, i + 7),
      );
    }

    /*
     * Add month label when a new month
     * starts inside the selected year.
     */
    const labels = weekColumns.map(
      (week) => {
        const monthStart = week.find(
          (day) => {
            const date = new Date(
              `${day.date}T00:00:00`,
            );

            return (
              day.inSelectedYear &&
              date.getDate() === 1
            );
          },
        );

        if (!monthStart) {
          return "";
        }

        const date = new Date(
          `${monthStart.date}T00:00:00`,
        );

        return date.toLocaleDateString(
          "en-US",
          {
            month: "short",
          },
        );
      },
    );

    const selectedYearDays =
      days.filter(
        (day) => day.inSelectedYear,
      );

    const maxCount = Math.max(
      ...selectedYearDays.map(
        (day) => day.count,
      ),
      1,
    );

    const totalCount =
      selectedYearDays.reduce(
        (sum, day) =>
          sum + day.count,
        0,
      );

    return {
      weeks: weekColumns,
      max: maxCount,
      total: totalCount,
      monthLabels: labels,
    };
  }, [
    data,
    selectedYear,
    currentYear,
  ]);

  const handlePreviousYear = () => {
    setSelectedYear(
      (previous) => previous - 1,
    );
  };

  const handleNextYear = () => {
    if (selectedYear < currentYear) {
      setSelectedYear(
        (previous) => previous + 1,
      );
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Activity
        </p>

        {/* Year navigation */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePreviousYear}
            aria-label="Previous year"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="min-w-12 text-center text-sm font-semibold text-slate-900 dark:text-white">
            {selectedYear}
          </span>

          <button
            type="button"
            onClick={handleNextYear}
            disabled={
              selectedYear === currentYear
            }
            aria-label="Next year"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="w-full overflow-x-auto pb-2">
        <div className="flex min-w-[700px]">
          {/* Weekday labels */}
          <div className="mr-3 flex w-8 shrink-0 flex-col justify-between pt-6">
            {WEEKDAY_LABELS.map(
              (label, index) => (
                <div
                  key={index}
                  className="flex h-3 items-center text-[10px] text-slate-400 dark:text-slate-500"
                >
                  {label}
                </div>
              ),
            )}
          </div>

          {/* Calendar content */}
          <div className="min-w-0 flex-1">
            {/* Month labels */}
            <div
              className="mb-2 grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
              }}
            >
              {monthLabels.map(
                (month, index) => (
                  <div
                    key={`${month}-${index}`}
                    className="overflow-visible whitespace-nowrap text-[10px] text-slate-400 dark:text-slate-500"
                  >
                    {month}
                  </div>
                ),
              )}
            </div>

            {/* Contribution grid */}
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
              }}
            >
              {weeks.map(
                (week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="flex flex-col gap-1"
                  >
                    {week.map((day) => {
                      const intensity =
                        getIntensity(
                          day.count,
                          max,
                        );

                      return (
                        <motion.div
                          key={day.date}
                          initial={{
                            opacity: 0,
                            scale: 0.5,
                          }}
                          whileInView={{
                            opacity: 1,
                            scale: 1,
                          }}
                          viewport={{
                            once: true,
                          }}
                          transition={{
                            duration: 0.2,
                            delay:
                              weekIndex *
                              0.01,
                          }}
                          onMouseEnter={() => {
                            if (
                              day.inSelectedYear
                            ) {
                              setHovered({
                                date: day.date,
                                count:
                                  day.count,
                              });
                            }
                          }}
                          onMouseLeave={() =>
                            setHovered(null)
                          }
                          className={`aspect-square w-full rounded-sm transition-transform ${
                            day.inSelectedYear
                              ? `${intensityClasses[intensity]} hover:scale-110`
                              : "bg-transparent"
                          }`}
                        />
                      );
                    })}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom information */}
      <div className="mt-4 flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
        <span>
          {hovered
            ? `${hovered.count} ${
                hovered.count === 1
                  ? "contribution"
                  : "contributions"
              } on ${new Date(
                `${hovered.date}T00:00:00`,
              ).toLocaleDateString(
                "en-IN",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              )}`
            : `${total} contributions in ${selectedYear}`}
        </span>

        <div className="flex items-center gap-1">
          <span>Less</span>

          {intensityClasses.map(
            (className, index) => (
              <span
                key={index}
                className={`h-2.5 w-2.5 rounded-sm ${className}`}
              />
            ),
          )}

          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendar;