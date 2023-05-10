import {useState} from "react"
import {
  useDelResume,
  useDupResume,
  useNewResume,
  useResumes,
} from "@/app/api/space"
import {PlusCircle} from "lucide-react"
import {useNavigate} from "react-router"

import {saveImage} from "@/lib/resume/database"
import {cn} from "@/lib/utils"
import {Icons} from "@/components/icons"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {Checkbox} from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Label} from "@/components/ui/label"
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area"
import {Separator} from "@/components/ui/separator"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import dayjs from "dayjs";
import {takeResume} from "@/lib/resume/resume-model";

export const MyResumes = () => {
  const {data: resumes} = useResumes("zh")
  const {trigger: delResume} = useDelResume()
  const {trigger: dupResume} = useDupResume()

  const [del, setDel] = useState(false)
  const [add, setAdd] = useState(false)
  const [edit, setEdit] = useState(false)
  const [deepDel, setDeepDel] = useState(false)
  const [selected, setSelected] = useState(0)

  const navigate = useNavigate()

  const onDel = (id: any) => {
    setDel(true)
    setSelected(id)
  }
  const onDeepDelChange = (e: any) => {
    setDeepDel(e)
  }
  const onOk = async () => {
    setDel(false)
    setDeepDel(false)
    await delResume({id: selected})
  }


  const onEdit = (id: any) => {
    takeResume(id)
    navigate("/editor")
  }

  const onDup = async (id: any, lang?: string) => {
    await dupResume({id, lang})
  }

  const onPrint = async (id: any) => {
    alert("暂不支持")
  }

  // @ts-ignore
  return (
    <>
      <div className="h-full px-4 py-6 lg:px-8">
        <Tabs defaultValue="music" className="h-full space-y-6">
          <div className="space-between flex items-center">
            <TabsList>
              <TabsTrigger value="music" className="relative">
                中文
              </TabsTrigger>
              <TabsTrigger value="podcasts"> English</TabsTrigger>
              <TabsTrigger value="live" disabled>
                Come soon
              </TabsTrigger>
            </TabsList>
            <div className="ml-auto mr-4">
              <NewResumeBtn/>
            </div>
          </div>
          <TabsContent value="music" className="border-none p-0 outline-none">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  个人简历
                </h2>
                <p className="text-sm text-muted-foreground">
                  精选个人技能、经历和成就，了解专业背景。
                </p>
              </div>
            </div>
            <Separator className="my-4"/>
            <div className="relative">
              <ScrollArea>
                <div
                  className="grid grid-flow-row grid-cols-4 2xl:grid-cols-5  lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-5 row-auto pb-4 place-self-center place-items-center place-content-center">
                  {
                    // @ts-ignore
                    resumes.map((resume) => (
                      <Card
                        className="space-y-3 p-1 max-w-[16rem]"
                        key={resume.id}
                      >
                        <div className=" rounded-md">
                          <img
                            src={resume.preview}
                            alt={resume.title}
                            width={20}
                            height={20}
                            className={cn(
                              "h-auto w-auto object-cover transition-all hover:scale-105",
                              "aspect-[3/4] w-[250px]"
                            )}
                          />
                        </div>
                        <div className="space-x-1 space-y-1 text-sm">
                          <h3 className="font-medium leading-none">
                            {resume.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {resume.description}
                          </p>

                          <div className="flex justify-between flex-row items-center">
                            <Label className="text-xs text-muted-foreground">
                              {dayjs(resume.update_at).format("YYYY-MM-DD hh:mm:ss")}
                            </Label>
                            <div>
                              <Button
                                onClick={() => onEdit(resume.id)}
                                variant="ghost"
                              >
                                <Icons.edit size={16}/>
                              </Button>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    // onClick={onDel}
                                    variant="ghost"
                                  >
                                    <Icons.more size={16}/>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem
                                    onClick={() => onDup(resume.id, "en")}
                                  >
                                    <Icons.trans size={16}/>
                                    <Label className="ml-1">复制为英文</Label>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => onPrint(resume.id)}
                                  >
                                    <Icons.print size={16}/>
                                    <Label className="ml-1">打印</Label>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => onDup(resume.id)}
                                  >
                                    <Icons.copy size={16}/>
                                    <Label className="ml-1">复制</Label>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => onDel(resume.id)}
                                  >
                                    <Icons.del size={16}/>
                                    <Label className="ml-1">删除</Label>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  }
                </div>
                <ScrollBar orientation="vertical"/>
              </ScrollArea>
            </div>
          </TabsContent>
          <TabsContent
            value="podcasts"
            className="h-full flex-col border-none p-0 data-[state=active]:flex"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Personal Resume
                </h2>
                <p className="text-sm text-muted-foreground">
                  Curated personal skills, experiences, and achievements to
                  understand the professional background.
                </p>
              </div>
            </div>
            <Separator className="my-4"/>
          </TabsContent>
        </Tabs>
      </div>
      <AlertDialog open={del}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              <>
                确认后将彻底删除 【后台开发工程师（校招) -
                腾讯基础架构】简历，此操作无法撤销。
                <div className="flex items-center space-x-2 mt-3">
                  <Checkbox
                    id="deep"
                    checked={deepDel}
                    onCheckedChange={onDeepDelChange}
                  />
                  <label
                    htmlFor="depp"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    删除该简历属下数据（未被其他简历所占用）
                  </label>
                </div>
              </>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDel(false)}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-500" onClick={onOk}>
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}


const NewResumeBtn = () => {
  const {trigger: newResume} = useNewResume()
  const navigate = useNavigate()

  const [desc, setDesc] = useState("")
  const [name, setName] = useState("")
  const [cover, setCover] = useState("")

  const handleFileSelected = (event: any) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setCover(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarClick = () => {
    // 打开文件选择器
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.addEventListener("change", handleFileSelected)
    input.click()
  }

  const onNew = async () => {
    const newID = Math.random()
    saveImage("" + newID, cover)
    await newResume({
      id: newID,
      title: name,
      description: desc,
      preview: "" + newID,
      lang: "zh",
    })
    takeResume(newID)
    navigate("/editor")
  }

  return <Dialog>
    <DialogTrigger asChild>
      <Button>
        <PlusCircle className="mr-2 h-4 w-4"/>
        新建
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>新建简历</DialogTitle>
        <DialogDescription>
          新建岗位，选择其语言版本、简历名称、简历描述
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            简历名
          </Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3"/>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            简历描述
          </Label>
          <Textarea id="username" value={desc} onChange={(e) => setDesc(e.target.value)} className="col-span-3"/>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            简历描述
          </Label>
          <Avatar className="h-[20rem] w-[15rem] rounded-none" onClick={handleAvatarClick}>
            <AvatarImage className="rounded-none" src={cover}/>
            <AvatarFallback className="rounded-none">CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            语言
          </Label>
          <Input id="name" value="中文" className="col-span-3" onChange={() => {
          }}/>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onNew}>确认</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
}

export const listenNowAlbums = [
  {
    name: "后台开发工程师（校招）",
    artist: "通用",
    cover:
      "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&dpr=2&q=80",
  },
  {
    name: "后台开发工程师（校招）",
    artist: "腾讯-基础架构",
    cover:
      "https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80",
  },
  {
    name: "全栈开发工程师（校招）",
    artist: "腾讯-后台开发",
    cover:
      "https://images.unsplash.com/photo-1528143358888-6d3c7f67bd5d?w=300&dpr=2&q=80",
  },
  {
    name: "Stateful Symphony",
    artist: "Beth Binary",
    cover:
      "https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80",
  },
  {
    name: "Stateful Symphony",
    artist: "Beth Binary",
    cover:
      "https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80",
  },
  {
    name: "Stateful Symphony",
    artist: "Beth Binary",
    cover:
      "https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80",
  },
  {
    name: "Stateful Symphony",
    artist: "Beth Binary",
    cover:
      "https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80",
  },
  {
    name: "Stateful Symphony",
    artist: "Beth Binary",
    cover:
      "https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80",
  },
  {
    name: "Stateful Symphony",
    artist: "Beth Binary",
    cover:
      "https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80",
  },
]
