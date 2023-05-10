import { cn } from "@/lib/utils"

interface BackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  bg: string
}

export function Background({
  bg,
  className,
  children,
  ...props
}: BackgroundProps) {
  return (
    <section
      className={cn(
        "h-screen max-w-screen-sm items-center gap-6 bg-contain bg-fixed bg-center",
        className
      )}
      style={{ backgroundImage: `url('/assets/${bg}')` }}
      {...props}
    >
      {children}
    </section>
  )
}
