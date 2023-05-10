import { FC, HTMLAttributes, forwardRef } from "react"

import { cn } from "@/lib/utils"

export const H1: FC<HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h1
    className={cn(
      "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      className
    )}
    {...props}
  >
    {children}
  </h1>
)

export const H2: FC<HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h2
    className={cn(
      "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
      className
    )}
    {...props}
  >
    {children}
  </h2>
)

export const H3: FC<HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3
    className={cn(
      "scroll-m-20 text-2xl font-semibold tracking-tight",
      className
    )}
    {...props}
  >
    {children}
  </h3>
)

export const H4: FC<HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h4
    className={cn(
      "scroll-m-20 text-xl font-semibold tracking-tight",
      className
    )}
    {...props}
  >
    {children}
  </h4>
)

export const P: FC<HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p
    className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
    {...props}
  >
    {children}
  </p>
)

export const BlockQuote: FC<HTMLAttributes<HTMLQuoteElement>> = ({
  className,
  children,
  ...props
}) => (
  <blockquote
    className={cn("mt-6 border-l-2 pl-6 italic", className)}
    {...props}
  >
    {children}
  </blockquote>
)

export const List: FC<HTMLAttributes<HTMLUListElement>> = ({
  className,
  children,
  ...props
}) => (
  <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} {...props}>
    {children}
  </ul>
)

export const Table: FC<HTMLAttributes<HTMLTableElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className="my-6 w-full overflow-y-auto">
    <table className={cn("w-full", className)} {...props}>
      {children}
    </table>
  </div>
)

export const Tr: FC<HTMLAttributes<HTMLTableRowElement>> = ({
  className,
  children,
  ...props
}) => (
  <tr className={cn("m-0 border-t p-0 even:bg-muted", className)} {...props}>
    {children}
  </tr>
)

export const Th: FC<HTMLAttributes<HTMLTableCellElement>> = ({
  className,
  children,
  ...props
}) => (
  <th
    className={cn(
      "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
      className
    )}
    {...props}
  >
    {children}
  </th>
)

export const Td: FC<HTMLAttributes<HTMLTableCellElement>> = ({
  className,
  children,
  ...props
}) => (
  <td
    className={cn(
      "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
      className
    )}
    {...props}
  >
    {children}
  </td>
)

export const InlineCode: FC<HTMLAttributes<HTMLSpanElement>> = ({
  className,
  children,
  ...props
}) => (
  <code
    className={cn(
      "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      className
    )}
    {...props}
  >
    {children}
  </code>
)

export const Lead: FC<HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn("text-xl text-muted-foreground", className)} {...props}>
    {children}
  </p>
)

export const Large: FC<HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn("text-lg font-semibold", className)} {...props}>
    {children}
  </p>
)

export const Small: FC<HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn("text-sm font-medium leading-none", className)} {...props}>
    {children}
  </p>
)

export const Muted = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </p>
))
