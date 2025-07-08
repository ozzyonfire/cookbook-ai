"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Combobox({
  options,
  selectedValues,
  onChange,
  placeholder,
  className,
}: {
  options: { label: string; values: string[] }[];
  selectedValues: string[];
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {placeholder}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[200px] p-0")}>
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            {options.map((option) => (
              <CommandGroup key={option.label} heading={option.label}>
                {option.values.map((value) => (
                  <CommandItem
                    key={value}
                    value={value}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                      // setOpen(false);
                    }}
                  >
                    {value}
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValues.includes(value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
