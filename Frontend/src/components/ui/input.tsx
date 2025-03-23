import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-green-100 selection:text-green-700 dark:bg-green-50/30 border-green-300",
          "flex h-9 w-[300px] min-w-0 rounded-md border bg-green-100 px-3 py-1 text-base text-green-800 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "hover:bg-green-200 focus-visible:border-green-500 focus-visible:ring-green-400/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-red-300 dark:aria-invalid:ring-red-400 aria-invalid:border-red-300",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
      )}
      {...props}
    />
  )
}

export { Input }
