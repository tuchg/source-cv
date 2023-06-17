import React, { Suspense } from "react"
import routes from "@/app/routes"
import { useRoutes } from "react-router"

import { ErrorBoundary } from "@/components/error-boundary"
import { SWRProvider, ThemeProvider, Toaster } from "@/components/providers"
import { TailwindIndicator } from "@/components/tailwind-indicator"

export default function App() {
  const routeEl = useRoutes(routes)

  return (
    <SWRProvider>
      <ThemeProvider>
        <div className="App">
          <ErrorBoundary
            fallbackRender={({ error }) => <div>{error?.message}</div>}
          >
            <Suspense fallback={<div className="mx-auto">Loading</div>}>
              {routeEl}
            </Suspense>
          </ErrorBoundary>
        </div>
        <Toaster />
        <TailwindIndicator />
      </ThemeProvider>
    </SWRProvider>
  )
}
