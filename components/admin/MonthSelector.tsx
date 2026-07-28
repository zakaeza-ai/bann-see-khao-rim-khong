"use client";

import { useRouter } from "next/navigation";

interface MonthOption {
  year: number;
  month: number;
  label: string;
}

export function MonthSelector({
  options,
  currentYear,
  currentMonth,
}: {
  options: MonthOption[];
  currentYear: number;
  currentMonth: number;
}) {
  const router = useRouter();

  return (
    <select
      defaultValue={`${currentYear}-${currentMonth}`}
      onChange={(e) => {
        const [y, m] = e.target.value.split("-");
        router.push(`/admin/reports?year=${y}&month=${m}`);
      }}
      className="px-4 py-2 rounded-lg border border-river-200 dark:border-[#1e2f3f] dark:bg-[#0b1520] text-sm"
    >
      {options.map((o) => (
        <option key={`${o.year}-${o.month}`} value={`${o.year}-${o.month}`}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
