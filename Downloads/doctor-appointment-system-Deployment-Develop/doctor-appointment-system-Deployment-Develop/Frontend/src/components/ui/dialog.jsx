"use client"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/components/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

function DialogOverlay({ className, ...props }) {
  return (
      <DialogPrimitive.Overlay
          data-slot="dialog-overlay"
          className={cn(
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px]",
              className,
          )}
          {...props}
      />
  )
}

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

function DialogContent({ className, children, ...props }) {
  return (
      <DialogPortal data-slot="dialog-portal">
        <DialogOverlay />
        <DialogPrimitive.Content
            data-slot="dialog-content"
            className={cn(
                "bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-3 rounded-md border border-teal-100 p-4 shadow-sm duration-150 sm:max-w-md",
                className,
            )}
            {...props}
        >
          {children}
          <DialogPrimitive.Close className="ring-offset-background focus:ring-ring absolute top-2 right-2 rounded-full h-6 w-6 flex items-center justify-center bg-teal-50 text-teal-700 opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
  )
}

DialogContent.displayName = DialogPrimitive.Content.displayName

function DialogHeader({ className, ...props }) {
  return (
      <div
          data-slot="dialog-header"
          className={cn("flex flex-col gap-1 text-center sm:text-left mb-1", className)}
          {...props}
      />
  )
}

DialogHeader.displayName = "DialogHeader"

function DialogFooter({ className, ...props }) {
  return (
      <div
          data-slot="dialog-footer"
          className={cn("flex flex-col-reverse gap-1.5 sm:flex-row sm:justify-end mt-1", className)}
          {...props}
      />
  )
}

DialogFooter.displayName = "DialogFooter"

function DialogTitle({ className, ...props }) {
  return (
      <DialogPrimitive.Title
          data-slot="dialog-title"
          className={cn("text-base leading-tight font-medium text-teal-900", className)}
          {...props}
      />
  )
}

DialogTitle.displayName = DialogPrimitive.Title.displayName

function DialogDescription({ className, ...props }) {
  return (
      <DialogPrimitive.Description
          data-slot="dialog-description"
          className={cn("text-xs text-teal-600", className)}
          {...props}
      />
  )
}
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
