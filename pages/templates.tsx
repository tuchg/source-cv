import { startTransition, useState } from "react"
import { settingsStore } from "@/pages/editor"
import { useDebounce } from "ahooks"
import { debounce } from "lodash-es"
import useSWR from "swr"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { List } from "@/components/ui/typography"
import dayjs from "dayjs";

const fetcher = (url: string) =>
  fetch(url, { method: "GET" }).then((res) => res.json())
const pageSize = 10

export const Templates = () => {
  const [searchQuery, setSearchQuery] = useState()
  const [target, setTarget] = useState(" ")
  const [currentPage, setCurrentPage] = useState(0)

  const { data, error, isLoading } = useSWR(
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

  const handleInstall = (name: string) => {
    console.log(name)
    settingsStore.template = name
  }
  const handleSubmit = (e: any) => {
    switch (e.key) {
      case "Enter":
        startTransition(() => {
          setTarget(searchQuery)
          setCurrentPage(0)
        })
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

  return (
    <div className="h-full max-h-screen m-1">
      <ScrollArea className="h-full max-h-screen p-2">
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
                  <h2 className="max-w-[20rem] text-xl font-bold">{item.package.name}</h2>
                  <p className="max-w-[20rem]">{item.package.description}</p>
                </div>
                <div className="flex-1"></div>
                <div>
                  <p>
                    最近更新：{ dayjs(item.package.date).format("YYYY-MM-DD")}
                  </p>
                  <p>版本：{item.package.version}</p>
                  <p>作者：{item.package.author?.name}</p>
                </div>
                <button
                  onClick={() => handleInstall(item.package.name)}
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
      </ScrollArea>
    </div>
  )
}
