import { Pagination } from "@nextui-org/react";

interface PaginacionProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  total: number;
  setCurrentPage: (page: number) => void;
  onChange: (page: number) => void;
}

export default function Paginacion({
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}: PaginacionProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  return (
    <Pagination
      page={currentPage}
      onChange={(page) => {
        setCurrentPage(page);
      }}
      total={totalPages}
      classNames={{
        item: "w-8 h-8 text-small rounded-2 bg-transparent",
        cursor:
          "bg-teal-500 shadow-lg from-default-500 to-default-800 text-white font-bold",
      }}
    />
  );
}
