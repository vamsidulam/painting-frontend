import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  page: number;
  pages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, pages, total, limit, onPageChange }: Props) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1 text-sm text-muted-foreground">
      <div>
        {total === 0 ? (
          "Showing 0 results"
        ) : (
          <>
            Showing{" "}
            <span className="font-semibold text-foreground">{start}</span>–
            <span className="font-semibold text-foreground">{end}</span> of{" "}
            <span className="font-semibold text-foreground">{total}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="h-9 gap-1 rounded-xl"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>
        <span className="px-2">
          Page <span className="font-semibold text-foreground">{page}</span> of{" "}
          <span className="font-semibold text-foreground">{pages}</span>
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(pages, page + 1))}
          disabled={page >= pages}
          className="h-9 gap-1 rounded-xl"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
