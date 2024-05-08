"use client";

import type { CraftSubmission, CraftVersion } from "@prisma/client";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { uniqBy } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Props {
  data: {
    page: number;
    pageSize: number;
    total: number;
    data: CraftSubmission[];
  };
  versions: CraftVersion[];
}

export function CraftResultsTable(props: Props) {
  const { data, versions } = props;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [pagination, setPagination] = useState({
    pageIndex: Number(searchParams.get("page") || 1) - 1,
    pageSize: Number(searchParams.get("pageSize") || 10),
  });

  useEffect(() => {
    router.push(
      `${pathname}?page=${pagination.pageIndex + 1}&pageSize=${
        pagination.pageSize
      }`
    );
  }, [pagination, pathname, router]);

  const columns = useMemo(() => {
    const allVersionPages = versions.reduce((acc, v) => {
      return [
        ...acc,
        ...v.data.pages.filter(
          (p) => p.type !== "statement" && p.type !== "end_screen"
        ),
      ];
    }, [] as FormCraft.CraftPage[]);

    const uniquePages = uniqBy(allVersionPages, (p) => p.id);

    return uniquePages.map((p) => ({
      header: p.title || p.description || "Untitled Page",
      accessorFn: (row: CraftSubmission) => {
        return row.data[p.id]?.value;
      },
      cell: (props: any) => {
        const value = props.getValue();

        return (
          <div
            className={cn({
              "text-gray-300 flex text-xs": !value,
            })}
          >
            {value || "N/A"}
          </div>
        );
      },
    }));
  }, [versions]);

  const table = useReactTable({
    data: data.data,
    columns,
    manualPagination: true,
    rowCount: data.total,
    onPaginationChange: setPagination,
    state: { pagination },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4 w-full h-full">
      <div className="w-full mb-4 max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold">Results</h1>
      </div>
      <ScrollArea className="max-h-[calc(100%-110px)] bg-background border rounded flex w-full max-w-screen-xl mx-auto overflow-hidden">
        <Table>
          <TableHeader className="sticky top-0 bg-secondary">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="flex items-center justify-center space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
