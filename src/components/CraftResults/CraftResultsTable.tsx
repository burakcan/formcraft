"use client";

import type { CraftSubmission, CraftVersion } from "@prisma/client";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import type { ColumnDef } from "@tanstack/react-table";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { uniqBy } from "lodash";
import { DownloadIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getPaginationWithEllipsis } from "@/lib/getPaginationWithEllipsis";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";

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
  const craftId = useEditCraftStore((s) => s.craft.id);

  const [showPartial, setShowPartial] = useState(
    searchParams.get("partial") === "true"
  );

  const [pagination, setPagination] = useState({
    pageIndex: Number(searchParams.get("page") || 1) - 1,
    pageSize: Number(searchParams.get("pageSize") || 10),
  });

  const totalPages = Math.ceil(data.total / pagination.pageSize);

  const paginationPages = getPaginationWithEllipsis(
    totalPages,
    pagination.pageIndex + 1,
    pagination.pageSize
  );

  useEffect(() => {
    setPagination((prev) => ({
      pageSize: prev.pageSize,
      pageIndex: 0,
    }));
  }, [showPartial]);

  useEffect(() => {
    router.push(
      `${pathname}?page=${pagination.pageIndex + 1}&pageSize=${
        pagination.pageSize
      }&partial=${showPartial}`
    );
  }, [pagination, pathname, router, showPartial]);

  const columns = useMemo<ColumnDef<CraftSubmission>[]>(() => {
    const allVersionPages = versions.reduce((acc, v) => {
      return [
        ...acc,
        ...v.data.pages.filter(
          (p) => p.type !== "statement" && p.type !== "end_screen"
        ),
      ];
    }, [] as FormCraft.CraftPage[]);

    const uniquePages = uniqBy(allVersionPages, (p) => p.id);

    const answerColumns = uniquePages.map<ColumnDef<CraftSubmission>>((p) => ({
      id: p.id,
      header: p.title || p.description || "Untitled Page",
      accessorFn: (row: CraftSubmission) => {
        return row.data[p.id]?.value;
      },
      cell: (ctx) => {
        const value = ctx.getValue() as string | undefined;

        return (
          <div
            className={cn(" min-w-48", {
              "text-gray-300 flex text-xs": !value,
            })}
          >
            {value || "N/A"}
          </div>
        );
      },
    }));

    return [
      {
        header: "Submitted at",
        accessorKey: "updatedAt",
        cell: (ctx) => {
          const value = ctx.getValue() as string | undefined;

          return (
            <div className={cn("min-w-32")} suppressHydrationWarning>
              {value
                ? new Date(value).toLocaleString("en-GB", {
                    year: "2-digit",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })
                : "N/A"}
            </div>
          );
        },
      },
      ...answerColumns,
    ];
  }, [versions]);

  const table = useReactTable({
    data: data.data,
    columns,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    rowCount: data.total,
    onPaginationChange: setPagination,
    state: { pagination },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4 w-full h-full">
      <div className="w-full mb-4 max-w-screen-xl mx-auto flex justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Results</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="show-partial">Include partial</Label>
            <Switch
              id="show-partial"
              checked={showPartial}
              onCheckedChange={setShowPartial}
            />
          </div>
          <Button variant="outline" asChild>
            <Link
              href={`/api/form/${craftId}/export-data?partial=${showPartial}`}
              prefetch={false}
              onClick={(e) => {
                e.nativeEvent.stopImmediatePropagation();
              }}
            >
              Export CSV
              <DownloadIcon className="size-4 ml-2" />
            </Link>
          </Button>
        </div>
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
      <div className="flex w-full items-center justify-between space-x-2 py-4 max-w-screen-xl mx-auto">
        <div className="text-sm text-gray-600">
          Showing {pagination.pageIndex * pagination.pageSize + 1}-{" "}
          {Math.min(
            data.total,
            (pagination.pageIndex + 1) * pagination.pageSize
          )}{" "}
          of {data.total} results
        </div>
        {totalPages > 1 && (
          <Pagination className="justify-end w-auto">
            <PaginationContent>
              <PaginationItem className="cursor-pointer">
                <PaginationPrevious
                  className={
                    !table.getCanPreviousPage()
                      ? " pointer-events-none opacity-50"
                      : ""
                  }
                  onClick={() => table.previousPage()}
                />
              </PaginationItem>
              {paginationPages.map((page, index) => (
                <PaginationItem key={index} className="cursor-pointer">
                  {page === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      isActive={page === pagination.pageIndex + 1}
                      onClick={() => table.setPageIndex(page - 1)}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem className="cursor-pointer">
                <PaginationNext
                  className={
                    !table.getCanNextPage()
                      ? " pointer-events-none opacity-50"
                      : ""
                  }
                  onClick={() => table.nextPage()}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
