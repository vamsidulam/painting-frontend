import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  type FormEvent,
} from "react";
import { ArrowLeft, Plus, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { CategoriesGrid } from "./CategoriesGrid";
import { Pagination } from "./Pagination";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { EditCategoryModal } from "./EditCategoryModal";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { ServicesPanel } from "./ServicesPanel";
import { CreateServiceModal } from "./CreateServiceModal";
import type { PaginationMeta, ServiceCategoryRecord } from "./data";

type ListResponse = {
  success: boolean;
  data: {
    rows: ServiceCategoryRecord[];
    pagination: PaginationMeta;
  };
};

export type CategoriesPanelHandle = {
  refetch: () => void;
};

const PAGE_SIZE = 9;

export const CategoriesPanel = forwardRef<CategoriesPanelHandle>(
  function CategoriesPanel(_, ref) {
    const [rows, setRows] = useState<ServiceCategoryRecord[]>([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);

    const [searchInput, setSearchInput] = useState("");
    const [committedSearch, setCommittedSearch] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] =
      useState<ServiceCategoryRecord | null>(null);
    const [deleteTarget, setDeleteTarget] =
      useState<ServiceCategoryRecord | null>(null);

    const [openCategory, setOpenCategory] =
      useState<ServiceCategoryRecord | null>(null);
    const [createServiceOpen, setCreateServiceOpen] = useState(false);

    const fetchPage = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
        });
        if (committedSearch) params.set("q", committedSearch);
        const res = await api<ListResponse>(
          `/admin/service-categories?${params.toString()}`,
        );
        setRows(res.data.rows);
        setTotal(res.data.pagination.total);
        setPages(res.data.pagination.pages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load categories",
        );
        setRows([]);
        setTotal(0);
        setPages(1);
      } finally {
        setLoading(false);
      }
    }, [page, committedSearch]);

    useEffect(() => {
      if (!openCategory) fetchPage();
    }, [fetchPage, openCategory]);

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

    const handleCategoryCreated = (created: ServiceCategoryRecord) => {
      setCreateOpen(false);
      if (page !== 1) setPage(1);
      else fetchPage();
      void created;
    };

    const handleCategoryUpdated = (updated: ServiceCategoryRecord) => {
      setRows((list) => list.map((r) => (r.id === updated.id ? updated : r)));
      setEditTarget(null);
      if (openCategory && openCategory.id === updated.id) {
        setOpenCategory(updated);
      }
    };

    const handleCategoryDeleted = () => {
      setDeleteTarget(null);
      if (rows.length === 1 && page > 1) setPage(page - 1);
      else fetchPage();
    };

    if (openCategory) {
      return (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpenCategory(null)}
                className="h-9 gap-1 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-3 min-w-0">
                {openCategory.image ? (
                  <img
                    src={openCategory.image}
                    alt={openCategory.name}
                    className="h-10 w-10 rounded-lg object-cover border border-border"
                  />
                ) : null}
                <div className="min-w-0">
                  <h2 className="font-display font-bold text-xl text-foreground line-clamp-1">
                    {openCategory.name}
                  </h2>
                  {openCategory.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {openCategory.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Button
              type="button"
              onClick={() => setCreateServiceOpen(true)}
              className="gap-2 h-10 rounded-xl"
            >
              <Plus className="h-4 w-4" />
              New Service
            </Button>
          </div>

          <ServicesPanel
            lockedCategoryId={openCategory.id}
            lockedCategoryName={openCategory.name}
          />

          <CreateServiceModal
            open={createServiceOpen}
            onOpenChange={setCreateServiceOpen}
            onCreated={() => {
              setCreateServiceOpen(false);
            }}
            defaultCategoryId={openCategory.id}
          />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <form
            onSubmit={handleSearchSubmit}
            className="flex gap-2 flex-1 min-w-0"
          >
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search categories by name or description — press Enter"
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
          <Button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="gap-2 h-10 rounded-xl"
          >
            <Plus className="h-4 w-4" />
            New Category
          </Button>
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

        <CategoriesGrid
          rows={rows}
          onOpen={setOpenCategory}
          onEdit={setEditTarget}
          onDelete={setDeleteTarget}
          emptyLabel={
            committedSearch
              ? `No categories match “${committedSearch}”.`
              : "No categories yet. Create one to get started."
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

        <CreateCategoryModal
          open={createOpen}
          onOpenChange={setCreateOpen}
          onCreated={handleCategoryCreated}
        />

        <EditCategoryModal
          category={editTarget}
          onClose={() => setEditTarget(null)}
          onUpdated={handleCategoryUpdated}
        />

        <DeleteCategoryDialog
          category={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleCategoryDeleted}
        />
      </div>
    );
  },
);
