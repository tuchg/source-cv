import React from "react"

import { Background } from "./background"
import { SiteHeader } from "./site-header"

interface LayoutProps {
  children: React.ReactNode
  noMenu?: boolean
  bg?: string
  title: string
}

export function Layout({ children, title, bg, noMenu = false }: LayoutProps) {
  return (
    <div className="mx-auto flex h-screen flex-col">
      <SiteHeader title={title} />
      <main className="flex-1">
        {bg ? (
          <Background className="h-full" bg={bg}>
            {children}
          </Background>
        ) : (
          children
        )}
      </main>
    </div>
  )
}
