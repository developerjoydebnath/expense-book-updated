'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subMonths } from "date-fns";
import { useMemo } from "react";

interface MonthYearPickerProps {
  value?: string; // Format: "yyyy-MM"
  onChange: (value: string | undefined) => void;
  className?: string;
}

export function MonthYearPicker({ value, onChange, className }: MonthYearPickerProps) {
  const options = useMemo(() => {
    const opts = [];
    const now = new Date();
    // Generate last 12 months including current
    for (let i = 0; i < 12; i++) {
      const date = subMonths(now, i);
      opts.push({
        label: format(date, "MMMM yyyy"),
        value: format(date, "yyyy-MM"),
      });
    }
    return opts;
  }, []);

  return (
    <div className={className}>
      <Select value={value} onValueChange={(val) => onChange(val || undefined)}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="All Months" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Months</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
