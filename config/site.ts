import { NavItem } from "@/types/nav"

const host = ""
export const siteConfig: SiteConfig = {
  name: "Demo",
  host: host,
  baseURL: `${host}/api/v0`,

  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
}

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    twitter: string
    github: string
    docs: string
  }
  baseURL: string
  host: string
}
