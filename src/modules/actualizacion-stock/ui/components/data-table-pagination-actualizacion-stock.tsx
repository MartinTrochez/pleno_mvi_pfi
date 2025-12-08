import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface DataPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total?: number;
}

export const DataPaginationHistorialVentas = ({
  page,
  totalPages,
  onPageChange,
  total,
}: DataPaginationProps) => {
  const start = (page - 1) * DEFAULT_PAGE_SIZE + 1;

  return (
    <div className="flex items-center justify-between text-sm text-[#B5B6BA]">
      <div className="flex-1 text-center">
        Mostrando {start}-{DEFAULT_PAGE_SIZE * page} de Productos
      </div>
      <div className="flex items-center border rounded-md overflow-hidden">
        <Button
          disabled={page === 1}
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="rounded-none border-r bg-white"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          disabled={page === totalPages || totalPages === 0}
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="rounded-none border-r bg-white"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
