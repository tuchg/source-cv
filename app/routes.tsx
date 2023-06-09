import { DataManager } from "@/pages/data-manager"
import ChatSection from "@/pages/editor/chat-section"
import { CodeSection } from "@/pages/editor/code-section"
import { DataSection } from "@/pages/editor/data-section"
import GptSection from "@/pages/editor/gpt-section"
import { Guide } from "@/pages/guide"
import Home from "@/pages/home"
import { MyResumes } from "@/pages/resumes"
import { Templates } from "@/pages/templates"
import { UserSpace } from "@/pages/user-space"
import { Route, RouteObject, Routes } from "react-router"

import { EditorLayout } from "@/components/editor/layout"

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/editor",
    element: <EditorLayout />,
    children: [
      {
        index: true,
        element: <DataSection />,
      },
      {
        path: "source",
        element: <CodeSection />,
      },
      {
        path: "guide",
        element: <GptSection />,
      },
      {
        path: "interview",
        element: <ChatSection />,
      },
      {
        path: "templates",
        element: <Templates />,
      },
      // {path: "*", element: <NoMatch/>},
    ],
  },
  {
    path: "/data",
    element: <DataManager />,
  },
  {
    path: "/space",
    element: <UserSpace />,
    children: [
      { index: true, element: <MyResumes /> },
      {
        path: "templates",
        element: <Templates />,
        // children: [
        //   {index: true, element: <CoursesIndex/>},
        //   {path: "/courses/:id", element: <Course/>},
        // ],
      },
      {
        path: "db",
        element: <DataManager />,
      },
      // {path: "*", element: <NoMatch/>},
    ],
  },
  {
    path: "/guide",
    element: <Guide />,
  },
]
