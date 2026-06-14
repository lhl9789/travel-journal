"use client"

import { useEffect } from "react"
import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import { useDebounceValue } from "usehooks-ts"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchKey?: string
  searchPlaceholder?: string
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = "검색...",
}: DataTableToolbarProps<TData>) {
  const [debouncedValue, setInputValue] = useDebounceValue("", 300)
  const isFiltered = table.getState().columnFilters.length > 0

  useEffect(() => {
    if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue(debouncedValue)
    }
  }, [debouncedValue, searchKey, table])

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center gap-2">
        {searchKey && (
          <Input
            placeholder={searchPlaceholder}
            onChange={(e) => setInputValue(e.target.value)}
            className="h-8 w-full max-w-sm"
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              table.resetColumnFilters()
              setInputValue("")
            }}
            className="h-8 px-2"
          >
            초기화
            <X className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
