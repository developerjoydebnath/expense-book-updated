'use client';

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  className?: string;
  disabledFuture?: boolean;
}

export function DatePicker({ value, onChange, className, disabledFuture }: DatePickerProps) {
  const date = value ? parseISO(value) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => date && onChange(format(date, "yyyy-MM-dd"))}
          initialFocus
          disabled={(date) => (disabledFuture ? date > new Date() : false)}
        />
      </PopoverContent>
    </Popover>
  );
}
