import { startTransition, useEffect, useState } from "react"
import { LogOutIcon } from "lucide-react"
import { Outlet, useLocation, useNavigate } from "react-router"
import { Link, NavLink } from "react-router-dom"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const menuItems = [
  { name: "我的简历", icon: Icons.resume, route: "/space" },
  { name: "简历模版", icon: Icons.template, route: "/space/templates" },
  { name: "履历库", icon: Icons.db, route: "/space/db" },
]
export const UserSpace = () => {
  const [selectedItem, setSelectedItem] = useState(1)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const { pathname, state } = useLocation()

  useEffect(() => {
    startTransition(() => {
      setSelectedItem(
        menuItems.findIndex((item) => item.route === pathname) + 1
      )
    })
  }, [pathname])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const navigate = useNavigate()
  return (
    <div className="max-h-screen h-screen max-w-screen flex">
      <div
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-blue-500 text-white flex flex-col transition-width duration-300`}
      >
        <div className="p-4 flex flex-row items-center">
          <Icons.laptop className="w-12 h-8 " />
          简历空间
        </div>
        <Separator />
        <div className="flex-grow">
          <ul className="space-y-2 p-4">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <li
                  key={index}
                  onClick={() => setSelectedItem(index + 1)}
                  className={`${
                    selectedItem === index + 1
                      ? "bg-blue-400"
                      : "hover:bg-blue-400"
                  } p-2 flex items-center space-x-4 rounded`}
                >
                  <NavLink to={item.route}>
                    <IconComponent className="w-6 h-6" />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="p-4 flex items-center">
          {!sidebarCollapsed && (
            <>
              <div className="text-lg font-bold mb-2">
                {localStorage.getItem("user-name")}
              </div>
              <Button
                variant="ghost"
                className="ml-3"
                onClick={() => navigate("/")}
              >
                <LogOutIcon size={20} />
              </Button>
              {/*<div className="text-sm">xxxx@mail.com</div>*/}
            </>
          )}
          <div className="ml-auto">
            <button
              onClick={toggleSidebar}
              className="p-2 bg-blue-400 text-white rounded"
            >
              {sidebarCollapsed ? (
                <Icons.sideClose className="w-6 h-6" />
              ) : (
                <Icons.sideOpen className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 max-h-screen overflow-y-scroll">
        <Outlet />
      </div>
    </div>
  )
}
