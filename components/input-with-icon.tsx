import React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { Search, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"

export function InputWithIcon({ ...props }) {
  // @ts-ignore
  return (
    <div className="flex h-fit w-full flex-1 justify-end bg-transparent">
      <div className="relative rounded-sm shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2">
          <Search className="h-4 w-4 shrink-0 opacity-50" />
        </div>
        <Input
          type="text"
          name="author"
          className="block h-[2rem] w-[11rem] rounded-sm border pl-9 pr-2 focus:outline-none sm:text-sm "
          {...props}
        />

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
          <CommandShortcut className="h-4 w-4 shrink-0 opacity-50 mr-2">
            ⌘K
          </CommandShortcut>
        </div>
      </div>
    </div>
  )
}
