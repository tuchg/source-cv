import { useState } from "react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export const SearchableSelect = ({ children }) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="搜索语言" />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            <CommandItem>测试·1</CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
