import { useState } from "react"
import { appStore, curSection } from "@/store"
import { get } from "lodash-es"
import { useLocation, useNavigate } from "react-router"
import { useSnapshot } from "valtio"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const subsections = [
  {
    key: "basics",
    label: "个人信息",
    icon: <Icons.person />,
  },
  {
    key: "projects",
    label: "项目经历",
    icon: <Icons.laptop />,
  },
  {
    key: "work",
    label: "工作经历",
    icon: <Icons.work />,
  },
  {
    key: "education",
    label: "教育经历",
    icon: <Icons.school />,
  },
  {
    key: "basics.profiles",
    label: "社交媒体",
    icon: <Icons.network />,
  },
  {
    key: "skills",
    label: "技能",
    icon: <Icons.code />,
  },
  {
    key: "languages",
    label: "语言",
    icon: <Icons.trans />,
  },
  {
    key: "certificates",
    label: "证书",
    icon: <Icons.bot />,
  },
  {
    key: "awards",
    label: "获奖经历",
    icon: <Icons.person />,
  },
  {
    key: "volunteer",
    label: "志愿经历",
    icon: <Icons.person />,
  },
  {
    key: "interests",
    label: "兴趣爱好",
    icon: <Icons.bot />,
  },
  {
    key: "references",
    label: "推荐人",
    icon: <Icons.person />,
  },
  {
    key: "publications",
    label: "出版物",
    icon: <Icons.bot />,
  },
]

export const DataSidebar = () => {
  const navigate = useNavigate()
  // const {pathname} = useLocation();
  const { curr } = useSnapshot(curSection)
  const model = useSnapshot(appStore.appModelWithReactive.data)

  const onDb = () => {
    console.log("db")
    navigate("/space/db")
  }

  const isActive = (key: string) => {
    return curr === key
  }

  const onSelected = (key: string) => {
    curSection.curr = key
    console.log(key)
  }

  return (
    <aside className="flex h-full flex-col max-w-[5rem] w-[5rem] space-y-5 p-2 border">
      <ScrollArea className="flex-1">
        <div className="flex flex-col space-y-5">
          {subsections
            .filter((sec) => get(appStore.appModelWithReactive.data, sec.key))
            .map(({ key, label, icon }) => (
              <Button
                key={key}
                variant="ghost"
                className={`p-0 flex flex-col justify-between space-y-1 items-center ${
                  isActive(key) ? "bg-accent text-accent-foreground" : ""
                }`}
                onClick={() => onSelected(key)}
              >
                {icon}
                <Label className="pt-1">{label}</Label>
              </Button>
            ))}
        </div>
      </ScrollArea>

      <Separator />
      <Button
        variant="ghost"
        className="p-0 flex flex-col justify-between space-y-1 items-center justify-self-end"
      >
        <Icons.plus/>
        <Label className="pt-1">自定义</Label>
      </Button>
      <Button
        variant="ghost"
        className="p-0 flex flex-col justify-between space-y-1 items-center justify-self-end"
        onClick={onDb}
      >
        <Icons.table />
        <Label className="pt-1">履历库</Label>
      </Button>
    </aside>
  )
}
