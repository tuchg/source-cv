import { startTransition, useEffect, useState } from "react"
import { print, share } from "@/pages/editor/preview-section"
import { appStore, settingsStore } from "@/store"
import { useLocation, useNavigate } from "react-router"
import { useSnapshot } from "valtio"

import { schemaToResume } from "@/lib/resume/resume-model"
import { EditableText } from "@/components/editable-text"
import { ResumeCommand } from "@/components/editor/command"
import { Icons } from "@/components/icons"
import { SearchableSelect } from "@/components/searchable-select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export const EditorHeader = ({ onSwap }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [section, setSection] = useState("")

  const { template } = useSnapshot(settingsStore)

  useEffect(() => {
    if (pathname.indexOf("source") > 0) {
      setSection("源码")
    } else if (
      pathname.indexOf("guide") > 0 ||
      pathname.indexOf("interview") > 0
    ) {
      setSection("AI助手")
    } else if (pathname.indexOf("templates") > 0) {
      setSection("模版")
    } else {
      setSection("数据")
    }
  }, [pathname])
  const onBack = () => {
    navigate("/space")
  }

  const goTemplates = () => {
    startTransition(() => {
      navigate("/editor/templates")
    })
  }

  const [langOpen, setLangOpen] = useState(false)
  const [modOpen, setModOpen] = useState(false)

  // const {lang} = useSnapshot(appStore.appModelWithReactive.data.meta._extra)
  const commandExec = (command: string) => {
    startTransition(() => {
      navigate(command)
    })
  }
  const onInterView = () => {
    setModOpen(false)
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

  const { lang } = useSnapshot(settingsStore)

  return (
    <header className="m-1">
      <div className="flex justify-between items-center">
        <div className="flex flex-row justify-between space-x-1 items-center">
          <Button className="h-8" variant="ghost" onClick={onBack}>
            <Icons.back size={16} />
          </Button>
          <EditableText modelKey="meta._extra" propKey="title" />

          <Popover open={langOpen} onOpenChange={setLangOpen}>
            <PopoverTrigger>
              <Badge variant="secondary">{lang}</Badge>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="搜索语言" />
                <CommandEmpty>尚未支持</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      settingsStore.lang = "English"
                      setLangOpen(false)
                    }}
                  >
                    English
                  </CommandItem>
                  <CommandItem
                    onSelect={() => {
                      settingsStore.lang = "简体中文"
                      setLangOpen(false)
                    }}
                  >
                    简体中文
                  </CommandItem>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover open={modOpen} onOpenChange={setModOpen}>
            <PopoverTrigger>
              <Badge variant="outline">{section}</Badge>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="搜索功能" />
                <CommandEmpty>未找到</CommandEmpty>
                <CommandGroup>
                  <CommandItem value="编写简历" onSelect={onEdit}>
                    <Icons.edit className="mr-2 h-4 w-4" />
                    <span>数据</span>
                    <CommandShortcut>Ctrl+I</CommandShortcut>
                  </CommandItem>
                  <CommandItem value="模拟面试" onSelect={onInterView}>
                    <Icons.bot className="mr-2 h-4 w-4" />
                    <span>面试模拟</span>
                    <CommandShortcut>Ctrl+I</CommandShortcut>
                  </CommandItem>
                  <CommandItem value="模版市场" onSelect={onTemplate}>
                    <Icons.resume className="mr-2 h-4 w-4" />
                    <span>简历模版</span>
                    <CommandShortcut>Ctrl+T</CommandShortcut>
                  </CommandItem>
                  <CommandItem value="源码编辑" onSelect={onSource}>
                    <Icons.code className="mr-2 h-4 w-4" />
                    <span>源码编辑</span>
                    <CommandShortcut>Ctrl+D</CommandShortcut>
                  </CommandItem>
                  <CommandItem value="简历指导" onSelect={onGuide}>
                    <Icons.date className="mr-2 h-4 w-4" />
                    <span>简历指导</span>
                    <CommandShortcut>Ctrl+I</CommandShortcut>
                  </CommandItem>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <nav className="hidden md:flex space-x-8">
          <ResumeCommand />
        </nav>
        <div className="flex items-center">
          <Button className="h-8 p-1 mx-1" variant="ghost" onClick={onSwap}>
            <Icons.swap size={16} className="mr-1" />
            交换
          </Button>
          <Button
            className="h-8 p-1 mx-1"
            variant="ghost"
            onClick={goTemplates}
          >
            <Icons.template size={16} className="mr-1" />
            模版 - {template.split("-theme-")[1]}
          </Button>
          <Button className="h-8 p-1 mx-1" variant="ghost" onClick={print}>
            <Icons.print size={16} className="mr-1" />
            打印
          </Button>
          <Button className="h-8 p-1 mx-1" variant="ghost" onClick={share}>
            <Icons.share size={16} className="mr-1" />
            分享
          </Button>
        </div>
      </div>
    </header>
  )
}
