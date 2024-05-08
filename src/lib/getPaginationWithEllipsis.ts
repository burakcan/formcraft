export const getPaginationWithEllipsis = (
  totalPages: number,
  currentPage: number,
  maxVisiblePages: number
): (number | "...")[] => {
  const pages: (number | "...")[] = [];

  // Helper function to add page numbers to the array
  const addPage = (pageNumber: number) => {
    pages.push(pageNumber);
  };

  // Helper function to add ellipsis to the array
  const addEllipsis = () => {
    pages.push("...");
  };

  // If total pages is less than or equal to maxVisiblePages, show all pages
  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      addPage(i);
    }
  } else {
    // Show first page
    addPage(1);

    // Calculate range around the current page
    const start = Math.max(
      2,
      currentPage - Math.floor((maxVisiblePages - 3) / 2)
    );
    const end = Math.min(totalPages - 1, start + maxVisiblePages - 4);

    // Add ellipsis if needed before the range
    if (start > 2) {
      addEllipsis();
    }

    // Add pages within the range
    for (let i = start; i <= end; i++) {
      addPage(i);
    }

    // Add ellipsis if needed after the range
    if (end < totalPages - 1) {
      addEllipsis();
    }

    // Show last page
    addPage(totalPages);
  }

  return pages;
};
