import { useNavigate } from "react-router"
import { Link } from "react-router-dom"

import { ThemeToggle } from "@/components/theme-toggle"
import { Icons } from "./icons"
import { Button } from "./ui/button"

export function SiteHeader({ title }) {
  const navigate = useNavigate()
  return (
    <header className="container sticky top-0 z-40 flex h-12 w-full items-center justify-between border-b border-b-slate-200 bg-white dark:border-b-slate-700 dark:bg-slate-900">
      <Button
        variant="ghost"
        className="items-center justify-center text-center"
        size="sm"
        onClick={() => navigate(-1)}
      >
        <Icons.home />
      </Button>
      <Link to="/">
        <span className="scroll-m-20 text-center tracking-tight">{title}</span>
      </Link>
      <nav className="items-center justify-end space-x-4">
        <ThemeToggle />
      </nav>
    </header>
  )
}
