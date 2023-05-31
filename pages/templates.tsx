import React, {startTransition, Suspense, useState} from "react"
import useSWR from "swr"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Label} from "@/components/ui/label"
import {ScrollArea} from "@/components/ui/scroll-area"
import {List} from "@/components/ui/typography"
import dayjs from "dayjs";
import {settingsStore} from "@/store";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {useMyTemplates} from "@/app/api/space";
import {delMyTemplate} from "@/lib/resume/database";
import {useSnapshot} from "valtio";

const fetcher = (url: string) =>
  fetch(url, {method: "GET"}).then((res) => res.json())
const pageSize = 10

export const Templates = () => {
  const handleInstall = (name: string) => {
    console.log(name)
    settingsStore.template = name
  }

  return (
    <div className="h-full max-h-screen m-1">
      <ScrollArea className="h-full max-h-screen p-2">
        <Tabs defaultValue="account" className="m-1 w-full">
          <TabsList>
            <TabsTrigger value="account">使用过的模版</TabsTrigger>
            <TabsTrigger value="password">在线模版</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <MyTemplates onInstall={handleInstall}/>
          </TabsContent>

          <TabsContent value="password">
            <Suspense fallback={<div>Loading..</div>}>
              <OnlineTemplates onInstall={handleInstall}/>
            </Suspense>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  )
}


function MyTemplates({onInstall}) {
  const {data, mutate} = useMyTemplates()
  const {template: currTemplate} = useSnapshot(settingsStore)
  const onDel = async (id: string) => {
    delMyTemplate(id)
    await mutate()
  }

  return <div
    className="grid grid-flow-row grid-cols-4 2xl:grid-cols-3  lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-5 row-auto pb-4 place-self-center place-items-center place-content-center">

    {data.length > 0 ?
      // @ts-ignore
      data.map((template) => (
        <Card
          className="space-y-3 p-4 max-w-[26rem]"
          key={template.id}
        >
          <div className=" rounded-md">
            <img
              src={template.preview}
              alt={template.name}
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
              {template.name.split("-theme-")[1]}
            </h3>
            <div className="flex justify-between flex-row items-center">
              <Label className="text-xs text-muted-foreground">
                {dayjs(template.update_at).format("YYYY-MM-DD hh:mm:ss")}
              </Label>
              {template.name === currTemplate ? <Label>正在使用</Label> :
                <>
                  <Button
                    onClick={() => onInstall(template.name)}
                    variant="ghost"
                  >
                    <Icons.check size={16}/>
                  </Button>
                  <Button
                    onClick={() => onDel(template.id)}
                    variant="ghost"
                  >
                    <Icons.del size={16}/>
                  </Button>
                </>
              }


            </div>
          </div>
        </Card>
      ))
      : <div className="mx-auto w-full h-full col-span-2 text-center">暂无数据</div>
    }
  </div>
}

function OnlineTemplates({onInstall}) {
  const [searchQuery, setSearchQuery] = useState()
  const [target, setTarget] = useState(" ")
  const [currentPage, setCurrentPage] = useState(0)

  const {data, error, isLoading} = useSWR(
    target
      ? `https://api.npms.io/v2/search?q=jsonresume-theme+${target}&size=${pageSize}&from=${
        currentPage * pageSize
      }`
      : null,
    fetcher
  )

  const handleChange = (e: any) => {
    setSearchQuery(e.target.value)
  }


  const handleSubmit = (e: any) => {
    switch (e.key) {
      case "Enter":
        setTarget(searchQuery?searchQuery:" ")
        setCurrentPage(0)
        break
    }
  }

  const handlePageChange = (newPage: any) => {
    startTransition(() => {
      setCurrentPage(newPage)
    })
  }

  if (error) return <div>Failed to load data</div>
  if (!data || isLoading) return <div>Loading...</div>

  const totalPages = Math.ceil(data.total / pageSize)

  return <>
    <input
      type="text"
      value={searchQuery}
      onChange={handleChange}
      placeholder="搜索简历模版"
      onKeyDown={handleSubmit}
      className="w-full p-2 border border-gray-300 rounded"
    />
    <List>
      {data.results.map((item: any) => (
        <li
          key={item.package.name}
          className="border p-4 rounded bg-white shadow"
        >
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>
                {item.package.author?.name.slice(0, 4)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="max-w-[20rem] text-xl font-bold">{item.package.name.split("-theme-")[1]}</h2>
              <p className="max-w-[20rem]">{item.package.description}</p>
            </div>
            <div className="flex-1"></div>
            <div>
              <p>
                最近更新：{dayjs(item.package.date).format("YYYY-MM-DD")}
              </p>
              <p>版本：{item.package.version}</p>
              <p>作者：{item.package.author?.name}</p>
            </div>
            <button
              onClick={() => onInstall(item.package.name)}
              className="ml-auto min-w-[5rem] px-4 py-2 bg-blue-500 text-white rounded"
            >
              应用
            </button>
          </div>
        </li>
      ))}
    </List>
    <div className="mt-4 flex justify-center space-x-2 items-center">
      <Label className="flex-1">共有主题: {data.total}</Label>
      <Label>当前页: {currentPage + 1}</Label>
      <Label>共 {Math.round(data.total / data.results.length)} 页</Label>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="p-2 bg-blue-500 text-white rounded"
      >
        上一页
      </button>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="p-2 bg-blue-500 text-white rounded"
      >
        下一页
      </button>
    </div>
  </>
}
