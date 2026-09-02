import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-red-600 text-white shadow hover:bg-red-700 active:scale-[0.98]",
        destructive:
          "bg-red-900/50 text-red-200 border border-red-800 hover:bg-red-900/80",
        outline:
          "border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 hover:text-white text-neutral-300",
        secondary:
          "bg-neutral-800 text-neutral-200 shadow-sm hover:bg-neutral-700",
        ghost: "hover:bg-neutral-800 hover:text-white text-neutral-400",
        link: "text-red-500 underline-offset-4 hover:underline",
        sovereign:
          "bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-lg shadow-red-950/50 hover:brightness-110",
        gold:
          "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-neutral-950 font-bold shadow-lg shadow-amber-950/40 hover:brightness-110",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
