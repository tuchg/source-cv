import { Suspense } from "react"
import { routes } from "@/app/routes"
import { useRoutes } from "react-router"

import { ErrorBoundary } from "@/components/error-boundary"
import { ToastProvider } from "@/components/ui/toast"
import { StateProvider, ThemeProvider } from "./provider"

export default function App() {
  const element = useRoutes(routes)

  return (
    <>
      <StateProvider>
        <ThemeProvider>
          <div className="App">
            <ErrorBoundary
              fallbackRender={({ error }) => <div>{error?.message}</div>}
            >
              <Suspense fallback={<div className="mx-auto">Loading</div>}>
                {element}
              </Suspense>
            </ErrorBoundary>
          </div>
          <ToastProvider />
        </ThemeProvider>
      </StateProvider>
    </>
  )
}
