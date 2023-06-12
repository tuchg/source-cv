import { useState } from "react"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const navigate = useNavigate()

  function onMake() {
    navigate("/editor")
  }

  return (
    <div className="flex h-full flex-col">
      <header className="relative z-50 pb-11 lg:pt-11">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center px-4 sm:justify-between sm:px-6 lg:flex-nowrap lg:px-8">
          <div className="mt-10 lg:mt-0 lg:grow lg:basis-0">
            <svg
              aria-hidden="true"
              viewBox="0 0 183 48"
              className="h-12 w-auto text-slate-900"
            >
              <path
                fill="#3B82F6"
                fill-rule="evenodd"
                d="M1.172 21.172a4 4 0 000 5.656l20 20a4 4 0 105.656-5.656l-20-20a4 4 0 00-5.656 0z"
                clip-rule="evenodd"
              ></path>
              <path
                fill="#93C5FD"
                fill-rule="evenodd"
                d="M26.828 6.828a4 4 0 10-5.656-5.656l-19 19A3.987 3.987 0 015 19a3.98 3.98 0 012.827 1.172L10.657 23 26.828 6.828z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <div className="order-first -mx-4 flex flex-auto basis-full overflow-x-auto whitespace-nowrap border-b border-blue-600/10 py-4 font-mono text-sm text-blue-600 sm:-mx-6 lg:order-none lg:mx-0 lg:basis-auto lg:border-0 lg:py-0">
            <div className="mx-auto flex items-center gap-4 px-4">
              <p>
                <time dateTime="2022-04-04">
                  {new Date().toLocaleTimeString()}
                </time>
                -
                <time dateTime="2022-04-06">
                  {new Date().toLocaleDateString()}
                </time>
              </p>
              <svg
                aria-hidden="true"
                viewBox="0 0 6 6"
                className="h-1.5 w-1.5 overflow-visible fill-current stroke-current"
              >
                <path
                  d="M3 0L6 3L3 6L0 3Z"
                  stroke-width="2"
                  stroke-linejoin="round"
                ></path>
              </svg>
              <p>SourceCV</p>
            </div>
          </div>
          <div className="hidden sm:mt-10 sm:flex lg:mt-0 lg:grow lg:basis-0 lg:justify-end">
             测试
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8 lg:pt-32">
          <h1 className="font-display mx-auto max-w-4xl text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
            WASM &
            <span className="relative whitespace-nowrap text-blue-600">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70"
                preserveAspectRatio="none"
              >
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path>
              </svg>
              <span className="relative"> AIGC </span>
            </span>{" "}
            for your personal resume.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
            用 WebAssembly + AIGC 创建高效、智能的个人简历
          </p>
          <div className="b-5 mt-10 flex justify-center gap-x-6 text-lg">
            <Link
              className="group inline-flex items-center justify-center rounded-full px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:text-slate-900 hover:ring-slate-300 focus:outline-none focus-visible:outline-blue-600 focus-visible:ring-slate-300 active:bg-slate-100 active:text-slate-600"
              to="/space"
            >
              <svg
                aria-hidden="true"
                className="h-3 w-3 flex-none fill-blue-600 group-active:fill-current"
              >
                <path d="m9.997 6.91-7.583 3.447A1 1 0 0 1 1 9.447V2.553a1 1 0 0 1 1.414-.91L9.997 5.09c.782.355.782 1.465 0 1.82Z"></path>
              </svg>
              <span className="ml-3">创建一份简历</span>
            </Link>
          </div>
          <div className="mt-36 lg:mt-44">
            <p className="font-display text-base text-slate-900">
              AI面试官 <span className="text-blue-600">✦</span> AI简历辅导{" "}
              <span className="text-blue-600">✦</span> 简历制作{" "}
              <span className="text-blue-600">✦</span> 海量模版
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

