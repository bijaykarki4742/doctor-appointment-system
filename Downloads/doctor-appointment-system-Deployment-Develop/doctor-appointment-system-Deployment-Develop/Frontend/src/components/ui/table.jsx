import * as React from "react"
import { cn } from "@/components/lib/utils"

function Table({ className, ...props }) {
    return (
        <div
            data-slot="table-container"
            className="relative w-full overflow-x-auto rounded-lg border border-teal-200 bg-white shadow-sm"
        >
            <table data-slot="table" className={cn("w-full caption-bottom text-sm", className)} {...props} />
        </div>
    )
}

function TableHeader({ className, ...props }) {
    return <thead data-slot="table-header" className={cn("bg-teal-50", className)} {...props} />
}

function TableBody({ className, ...props }) {
    return <tbody data-slot="table-body" className={cn("[&_tr:last-child]:border-0", className)} {...props} />
}

function TableFooter({ className, ...props }) {
    return (
        <tfoot
            data-slot="table-footer"
            className={cn("bg-teal-50 border-t border-teal-200 font-medium [&>tr]:last:border-b-0", className)}
            {...props}
        />
    )
}

function TableRow({ className, ...props }) {
    return (
        <tr
            data-slot="table-row"
            className={cn(
                "border-b border-teal-100 transition-colors whitespace-nowrap hover:bg-teal-50/70 data-[state=selected]:bg-teal-100",
                className,
            )}
            {...props}
        />
    )
}

function TableHead({ className, ...props }) {
    return (
        <th
            data-slot="table-head"
            className={cn(
                "text-teal-800 h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] border-b border-teal-200",
                className,
            )}
            {...props}
        />
    )
}

function TableCell({ className, ...props }) {
    return (
        <td
            data-slot="table-cell"
            className={cn(
                "p-2 align-middle text-gray-700 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                className,
            )}
            {...props}
        />
    )
}

function TableCaption({ className, ...props }) {
    return (
        <caption data-slot="table-caption" className={cn("text-teal-600 mt-3 text-sm font-medium", className)} {...props} />
    )
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
