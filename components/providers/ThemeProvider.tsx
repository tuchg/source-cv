import { ReactNode } from "react"
import { ThemeProvider as Provider } from "next-themes"

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <Provider attribute="class" enableSystem={true}>
      {children}
    </Provider>
  )
}
