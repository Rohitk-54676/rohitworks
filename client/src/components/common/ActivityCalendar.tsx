import { useMemo, useState } from "react";
import { motion } from "framer-motion";

interface ActivityCalendarProps {
  data: Array<{ date: string; count: number }>;
  accentClass?: string;
}

const WEEKS_TO_SHOW = 26; // ~6 months, keeps it readable on mobile + desktop

function getIntensity(count: number, max: number): number {
  if (count === 0 || max === 0) return 0;
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

const ActivityCalendar = ({ data }: ActivityCalendarProps) => {
  const [hovered, setHovered] = useState<{
    date: string;
    count: number;
  } | null>(null);

  const { weeks, max, totalInRange } = useMemo(() => {
    const byDate = new Map(data.map((entry) => [entry.date, entry.count]));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Align the grid so the last column ends on the current week
    const daysToShow = WEEKS_TO_SHOW * 7;
    const start = new Date(today);
    start.setDate(start.getDate() - daysToShow + 1);
    // Roll back to the most recent Sunday for clean week columns
    start.setDate(start.getDate() - start.getDay());

    const days: Array<{ date: string; count: number }> = [];
    const cursor = new Date(start);

    while (cursor <= today) {
      const iso = cursor.toISOString().slice(0, 10);
      days.push({ date: iso, count: byDate.get(iso) ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    const weekColumns: Array<Array<{ date: string; count: number }>> = [];
    for (let i = 0; i < days.length; i += 7) {
      weekColumns.push(days.slice(i, i + 7));
    }

    const maxCount = Math.max(...days.map((day) => day.count), 1);
    const total = days.reduce((sum, day) => sum + day.count, 0);

    return { weeks: weekColumns, max: maxCount, totalInRange: total };
  }, [data]);

  return (
    <div>
      <div className="flex items-start gap-1 overflow-x-auto pb-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day) => {
              const intensity = getIntensity(day.count, max);

              return (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.2,
                    delay: weekIndex * 0.012,
                  }}
                  onMouseEnter={() =>
                    setHovered({ date: day.date, count: day.count })
                  }
                  onMouseLeave={() => setHovered(null)}
                  className={`h-2.5 w-2.5 shrink-0 rounded-sm ${intensityClasses[intensity]}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          {hovered
            ? `${hovered.count} ${hovered.count === 1 ? "contribution" : "contributions"} on ${new Date(hovered.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}`
            : `${totalInRange} contributions in the last ${WEEKS_TO_SHOW * 7} days`}
        </span>

        <div className="flex items-center gap-1">
          <span>Less</span>
          {intensityClasses.map((cls, index) => (
            <span key={index} className={`h-2.5 w-2.5 rounded-sm ${cls}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendar;
