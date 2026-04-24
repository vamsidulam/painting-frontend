import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { ServicesTable } from "./ServicesTable";
import { Pagination } from "./Pagination";
import { EditServiceModal } from "./EditServiceModal";
import { DeleteServiceDialog } from "./DeleteServiceDialog";
import type {
  PaginationMeta,
  ServiceCategoryRecord,
  ServiceRecord,
} from "./data";

type ListResponse = {
  success: boolean;
  data: { rows: ServiceRecord[]; pagination: PaginationMeta };
};

type CategoriesResponse = {
  success: boolean;
  data: { rows: ServiceCategoryRecord[]; pagination: PaginationMeta };
};

type Props = {
  headerAction?: ReactNode;
  searchPlaceholder?: string;
  lockedCategoryId?: string;
  lockedCategoryName?: string;
};

export type ServicesPanelHandle = {
  refetch: () => void;
};

const PAGE_SIZE = 10;

export const ServicesPanel = forwardRef<ServicesPanelHandle, Props>(
  function ServicesPanel(
    {
      headerAction,
      searchPlaceholder = "Search by name or description — press Enter",
      lockedCategoryId,
      lockedCategoryName,
    },
    ref,
  ) {
    const [rows, setRows] = useState<ServiceRecord[]>([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);

    const [searchInput, setSearchInput] = useState("");
    const [committedSearch, setCommittedSearch] = useState("");
    const [categoryId, setCategoryId] = useState<string>(
      lockedCategoryId ?? "all",
    );

    const [categories, setCategories] = useState<ServiceCategoryRecord[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [editTarget, setEditTarget] = useState<ServiceRecord | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ServiceRecord | null>(
      null,
    );

    useEffect(() => {
      if (lockedCategoryId) {
        setCategoryId(lockedCategoryId);
      }
    }, [lockedCategoryId]);

    useEffect(() => {
      if (lockedCategoryId) return;
      let cancelled = false;
      api<CategoriesResponse>("/admin/service-categories?page=1&limit=100")
        .then((res) => {
          if (!cancelled) setCategories(res.data.rows);
        })
        .catch(() => {
          if (!cancelled) setCategories([]);
        });
      return () => {
        cancelled = true;
      };
    }, [lockedCategoryId]);

    const fetchPage = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
        });
        if (committedSearch) params.set("q", committedSearch);
        if (categoryId !== "all") params.set("categoryId", categoryId);

        const res = await api<ListResponse>(
          `/admin/services?${params.toString()}`,
        );
        setRows(res.data.rows);
        setTotal(res.data.pagination.total);
        setPages(res.data.pagination.pages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load services",
        );
        setRows([]);
        setTotal(0);
        setPages(1);
      } finally {
        setLoading(false);
      }
    }, [page, committedSearch, categoryId]);

    useEffect(() => {
      fetchPage();
    }, [fetchPage]);

    useImperativeHandle(
      ref,
      () => ({
        refetch: () => {
          if (page !== 1) setPage(1);
          else fetchPage();
        },
      }),
      [fetchPage, page],
    );

    const handleSearchSubmit = (e: FormEvent) => {
      e.preventDefault();
      const next = searchInput.trim();
      if (next === committedSearch) return;
      setPage(1);
      setCommittedSearch(next);
    };

    const handleClearSearch = () => {
      setSearchInput("");
      if (committedSearch !== "") {
        setPage(1);
        setCommittedSearch("");
      }
    };

    const handleCategoryChange = (next: string) => {
      if (next === categoryId) return;
      setPage(1);
      setCategoryId(next);
    };

    const handleServiceUpdated = (updated: ServiceRecord) => {
      setRows((list) => list.map((r) => (r.id === updated.id ? updated : r)));
      setEditTarget(null);
      if (categoryId !== "all" && updated.categoryId !== categoryId) {
        fetchPage();
      }
    };

    const handleServiceDeleted = () => {
      setDeleteTarget(null);
      if (rows.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchPage();
      }
    };

    const showFilters = !lockedCategoryId;

    return (
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          {showFilters && categories.length > 0 && (
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-muted w-fit overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => handleCategoryChange("all")}
                className={`px-3 h-8 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  categoryId === "all"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              {categories.map((c) => {
                const active = categoryId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCategoryChange(c.id)}
                    className={`px-3 h-8 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      active
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          )}

          <form
            onSubmit={handleSearchSubmit}
            className="flex gap-2 flex-1 min-w-0"
          >
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-10 pr-10 h-10 rounded-xl bg-background"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button type="submit" variant="outline" className="h-10 rounded-xl">
              Search
            </Button>
          </form>

          {headerAction}
        </div>

        {committedSearch && (
          <div className="text-xs text-muted-foreground">
            Results for{" "}
            <span className="font-semibold text-foreground">
              “{committedSearch}”
            </span>
            <button
              type="button"
              onClick={handleClearSearch}
              className="ml-2 underline hover:text-foreground"
            >
              clear
            </button>
          </div>
        )}

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2 flex items-center justify-between gap-3">
            <span>{error}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fetchPage()}
              className="h-8 rounded-lg"
            >
              Retry
            </Button>
          </div>
        )}

        <ServicesTable
          rows={rows}
          onEdit={setEditTarget}
          onDelete={setDeleteTarget}
          emptyLabel={
            committedSearch
              ? `No services match “${committedSearch}”.`
              : lockedCategoryName
                ? `No services yet in ${lockedCategoryName}.`
                : "No services yet. Create one to get started."
          }
          loading={loading}
        />

        <Pagination
          page={page}
          pages={pages}
          total={total}
          limit={PAGE_SIZE}
          onPageChange={setPage}
        />

        <EditServiceModal
          service={editTarget}
          onClose={() => setEditTarget(null)}
          onUpdated={handleServiceUpdated}
        />
        <DeleteServiceDialog
          service={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleServiceDeleted}
        />
      </div>
    );
  },
);
