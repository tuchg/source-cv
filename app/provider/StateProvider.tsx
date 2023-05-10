import { FC, ReactNode } from "react"
import { SWRConfig } from "swr"

const swrOptions = {
  keepPreviousData: true,
  suspense: true,
}

export const StateProvider: FC<{
  children: ReactNode
  noDevtools?: boolean
}> = ({ children, noDevtools }) => {
  return <SWRConfig value={swrOptions}>{children}</SWRConfig>
}
