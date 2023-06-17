import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export const Sidebar = () => {
  return (
    <aside className="flex h-full flex-col max-w-[5rem] w-[5rem] space-y-5 p-2 border">
      <Button
        variant="ghost"
        className="p-0 flex flex-col justify-between space-y-1 items-center"
      >
        <Icons.person />
        <Label className="pt-1">个人信息</Label>
      </Button>

      <Button
        variant="ghost"
        className=" p-0 flex flex-col justify-between space-y-1 items-center"
      >
        <Icons.laptop />
        <Label className="pt-1">项目经历</Label>
      </Button>

      <Button
        variant="ghost"
        className="p-0 flex flex-col justify-between space-y-1 items-center"
      >
        <Icons.work />
        <Label className="pt-1">工作经历</Label>
      </Button>

      <div className="flex-1" />
      <Separator />
      <Button
        variant="ghost"
        className="p-0 flex flex-col justify-between space-y-1 items-center justify-self-end"
      >
        <Icons.plus />
        <Label className="pt-1">自定义</Label>
      </Button>
      <Button
        variant="ghost"
        className="p-0 flex flex-col justify-between space-y-1 items-center justify-self-end"
      >
        <Icons.table />
        <Label className="pt-1">履历库</Label>
      </Button>
    </aside>
  )
}
