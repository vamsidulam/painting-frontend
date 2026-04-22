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
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { UsersTable } from "./UsersTable";
import { Pagination } from "./Pagination";
import { EditUserModal } from "./EditUserModal";
import { DeleteUserDialog } from "./DeleteUserDialog";
import type { PaginationMeta, UserRecord, UserRole } from "./data";

type ListResponse = {
  success: boolean;
  data: { rows: UserRecord[]; pagination: PaginationMeta };
};

type Props = {
  title: string;
  description: string;
  role: UserRole;
  headerAction?: ReactNode;
  searchPlaceholder?: string;
};

export type UsersPanelHandle = {
  refetch: () => void;
};

const basePath: Record<UserRole, string> = {
  admin: "/admin/users/adminusers",
  customer: "/admin/users/customers",
};

const PAGE_SIZE = 10;

export const UsersPanel = forwardRef<UsersPanelHandle, Props>(
  function UsersPanel(
    {
      title,
      description,
      role,
      headerAction,
      searchPlaceholder = "Search by name, email or phone — press Enter",
    },
    ref,
  ) {
    const { user: currentUser } = useAuth();

    const [rows, setRows] = useState<UserRecord[]>([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);

    const [searchInput, setSearchInput] = useState("");
    const [committedSearch, setCommittedSearch] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [editTarget, setEditTarget] = useState<UserRecord | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<UserRecord | null>(null);

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
          `${basePath[role]}?${params.toString()}`,
        );
        setRows(res.data.rows);
        setTotal(res.data.pagination.total);
        setPages(res.data.pagination.pages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
        setRows([]);
        setTotal(0);
        setPages(1);
      } finally {
        setLoading(false);
      }
    }, [role, page, committedSearch]);

    useEffect(() => {
      fetchPage();
    }, [fetchPage]);

    useImperativeHandle(ref, () => ({
      refetch: () => {
        if (page !== 1) setPage(1);
        else fetchPage();
      },
    }), [fetchPage, page]);

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

    const handleUserUpdated = (updated: UserRecord) => {
      setRows((list) => list.map((r) => (r.id === updated.id ? updated : r)));
      setEditTarget(null);
    };

    const handleUserDeleted = (id: string) => {
      setDeleteTarget(null);
      // If we just removed the last row on a non-first page, step back.
      if (rows.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchPage();
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-xl text-foreground">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {headerAction}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
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

        <UsersTable
          rows={rows}
          onEdit={setEditTarget}
          onDelete={(u) => {
            if (currentUser?.id === u.id) {
              toast.error("You can't delete your own account");
              return;
            }
            setDeleteTarget(u);
          }}
          emptyLabel={
            committedSearch
              ? `No ${role === "admin" ? "admins" : "customers"} match “${committedSearch}”.`
              : `No ${role === "admin" ? "admins" : "customers"} yet.`
          }
          loading={loading}
          currentUserId={currentUser?.id}
        />

        <Pagination
          page={page}
          pages={pages}
          total={total}
          limit={PAGE_SIZE}
          onPageChange={setPage}
        />

        <EditUserModal
          user={editTarget}
          role={role}
          onClose={() => setEditTarget(null)}
          onUpdated={handleUserUpdated}
        />
        <DeleteUserDialog
          user={deleteTarget}
          role={role}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleUserDeleted}
        />
      </div>
    );
  },
);
