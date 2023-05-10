import { startTransition, useEffect, useState } from "react"
import { Outlet, useLocation } from "react-router"
import { Link, NavLink } from "react-router-dom"

import { Icons } from "@/components/icons"

const menuItems = [
  { name: "我的简历", icon: Icons.resume, route: "/space" },
  { name: "简历模版", icon: Icons.template, route: "/space/templates" },
  { name: "履历库", icon: Icons.db, route: "/space/db" },
]
export const UserSpace = () => {
  const [selectedItem, setSelectedItem] = useState(1)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const { pathname } = useLocation()

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

  return (
    <div className="max-h-screen h-screen max-w-screen flex">
      <div
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-blue-500 text-white flex flex-col transition-width duration-300`}
      >
        <div className="p-4">
          <Icons.laptop className="w-32 h-8" />
        </div>
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
            <div>
              <div className="text-lg font-bold mb-2">test</div>
              <div className="text-sm">xxxx@mail.com</div>
            </div>
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
