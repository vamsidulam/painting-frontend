import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { Plus, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Pagination } from "@/components/admin/servicemanagement/Pagination";
import { ProjectsGrid } from "./ProjectsGrid";
import { CreateProjectModal } from "./CreateProjectModal";
import { EditProjectModal } from "./EditProjectModal";
import { DeleteProjectDialog } from "./DeleteProjectDialog";
import type { PaginationMeta, ProjectRecord } from "./data";

type ListResponse = {
  success: boolean;
  data: { rows: ProjectRecord[]; pagination: PaginationMeta };
};

const PAGE_SIZE = 12;

export function ProjectsPanel() {
  const [rows, setRows] = useState<ProjectRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ProjectRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectRecord | null>(null);

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
        `/admin/projects?${params.toString()}`,
      );
      setRows(res.data.rows);
      setTotal(res.data.pagination.total);
      setPages(res.data.pagination.pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
      setRows([]);
      setTotal(0);
      setPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, committedSearch]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

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

  const handleCreated = () => {
    setCreateOpen(false);
    if (page !== 1) setPage(1);
    else fetchPage();
  };

  const handleUpdated = (updated: ProjectRecord) => {
    setRows((list) => list.map((r) => (r.id === updated.id ? updated : r)));
    setEditTarget(null);
  };

  const handleDeleted = () => {
    setDeleteTarget(null);
    if (rows.length === 1 && page > 1) setPage(page - 1);
    else fetchPage();
  };

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
              placeholder="Search projects by name — press Enter"
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
          New Project
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

      <ProjectsGrid
        rows={rows}
        onEdit={setEditTarget}
        onDelete={setDeleteTarget}
        emptyLabel={
          committedSearch
            ? `No projects match “${committedSearch}”.`
            : "No projects yet. Create one to get started."
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

      <CreateProjectModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={handleCreated}
      />

      <EditProjectModal
        project={editTarget}
        onClose={() => setEditTarget(null)}
        onUpdated={handleUpdated}
      />

      <DeleteProjectDialog
        project={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
