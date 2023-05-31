import {startTransition, useState} from "react"
import {useNavigate} from "react-router"

import {Icons} from "@/components/icons"
import {InputWithIcon} from "@/components/input-with-icon"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {schemaToResume} from "@/lib/resume/resume-model";

export function ResumeCommand() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const onFocus = () => {
    setOpen(true)
  }

  const onBlur = () => {
    setOpen(false)
  }

  const commandExec = (command: string) => {
    startTransition(() => {
      onBlur()
      navigate(command)
    })
  }
  const onInterView = () => {
    commandExec("/editor/interview")
  }

  const onTemplate = () => {
    commandExec("/editor/templates")
  }

  const onGuide = () => {
    commandExec("/editor/guide")
  }
  const onTheme = () => {
    commandExec("/editor/theme")
  }

  const onSource = () => {
    commandExec("/editor/source")
  }
  const onDb = () => {
    commandExec("/space/db")
  }

  const onEdit = () => {
    schemaToResume()
    commandExec("/editor")
  }

  return (
    <>
      <InputWithIcon
        placeholder="你想要做什么？"
        onFocus={onFocus}
        onBlur={onBlur}
      />

      <CommandDialog open={open} onOpenChange={setOpen} modal>
        <CommandInput
          className="w-full"
          placeholder="搜索指令"
          onFocus={onFocus}
          // onBlur={onBlur}
        />
        <CommandList>
          <CommandEmpty>没有该系统指令</CommandEmpty>
          <CommandGroup heading="建议">
            <CommandItem value="编写简历" onSelect={onEdit}>
              <Icons.edit className="mr-2 h-4 w-4"/>
              <span>编写简历</span>
              <CommandShortcut>Ctrl+I</CommandShortcut>
            </CommandItem>
            <CommandItem value="模拟面试" onSelect={onInterView}>
              <Icons.bot className="mr-2 h-4 w-4"/>
              <span>模拟面试</span>
              <CommandShortcut>Ctrl+I</CommandShortcut>
            </CommandItem>
            <CommandItem value="模版市场" onSelect={onTemplate}>
              <Icons.resume className="mr-2 h-4 w-4"/>
              <span>模版市场</span>
              <CommandShortcut>Ctrl+T</CommandShortcut>
            </CommandItem>
            {/*            <CommandItem value="主题编辑" onSelect={onTheme}>
              <Icons.template className="mr-2 h-4 w-4"/>
              <span>主题编辑</span>
              <CommandShortcut>Ctrl+Shift+T</CommandShortcut>
            </CommandItem>*/}
            <CommandItem value="源码编辑" onSelect={onSource}>
              <Icons.code className="mr-2 h-4 w-4"/>
              <span>源码编辑</span>
              <CommandShortcut>Ctrl+D</CommandShortcut>
            </CommandItem>
            <CommandItem value="简历指导" onSelect={onGuide}>
              <Icons.date className="mr-2 h-4 w-4"/>
              <span>简历指导</span>
              <CommandShortcut>Ctrl+I</CommandShortcut>
            </CommandItem>
            <CommandItem value="履历管理" onSelect={onDb}>
              <Icons.db className="mr-2 h-4 w-4"/>
              <span>履历管理</span>
              <CommandShortcut>Ctrl+B</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator/>
          <CommandGroup heading="Settings">
            <CommandItem>
              <Icons.settings className="mr-2 h-4 w-4"/>
              <span>Profile</span>
              <CommandShortcut>Ctrl+P</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
