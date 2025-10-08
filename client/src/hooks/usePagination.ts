import { useMemo } from "react";

export interface UsePaginationProps<T> {
  data: T[];
  currentPage: number;
  itemsPerPage: number;
}

export function usePagination<T>({
  data,
  currentPage,
  itemsPerPage,
}: UsePaginationProps<T>) {
  const totalPages = useMemo(
    () => Math.ceil(data.length / itemsPerPage),
    [data.length, itemsPerPage]
  );

  const paginatedData = useMemo(
    () =>
      data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [data, currentPage, itemsPerPage]
  );

  return {
    paginatedData,
    totalPages,
  };
}