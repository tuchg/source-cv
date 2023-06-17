import Editor from "@/app/editor"
import DataSection from "@/app/editor/data"
import GptSection from "@/app/editor/guide"
import Interview from "@/app/editor/interview"
import NotFound from "@/app/not-found"
import UserSpace from "@/app/space"
import DataManager from "@/app/space/data"
import MyResumes from "@/app/space/resume"
import Templates from "@/app/space/template"
import type { RouteObject } from "react-router"

const routes: RouteObject[] = [
  {
    path: "/",
    element: <UserSpace />,
  },
  {
    path: "/space",
    element: <UserSpace />,
    children: [
      { index: true, element: <MyResumes /> },
      {
        path: "templates",
        element: <Templates />,
      },
      {
        path: "db",
        element: <DataManager />,
      },
      // {path: "*", element: <NoMatch/>},
    ],
  },
  {
    path: "/editor",
    element: <Editor />,
    children: [
      {
        index: true,
        element: <DataSection />,
      },
      {
        path: "source",
        element: <Templates />,
      },
      {
        path: "guide",
        element: <GptSection />,
      },
      {
        path: "interview",
        element: <Interview />,
      },
      {
        path: "templates",
        element: <Templates />,
      },
      // {path: "*", element: <NoMatch/>},
    ],
  },
  { path: "*", element: <NotFound /> },
]

export default routes
