import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { Search, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { OrdersTable } from "./OrdersTable";
import { Pagination } from "./Pagination";
import { ViewOrderModal } from "./ViewOrderModal";
import { DeleteOrderDialog } from "./DeleteOrderDialog";
import type {
  OrderRecord,
  OrderWorkStatus,
  PaginationMeta,
  StatusFilter,
  WorkStatusFilter,
} from "./data";

type ListResponse = {
  success: boolean;
  data: { rows: OrderRecord[]; pagination: PaginationMeta };
};

type UpdateResponse = {
  success: boolean;
  data: { order: OrderRecord };
};

const PAGE_SIZE = 10;

export function OrdersPanel() {
  const [rows, setRows] = useState<OrderRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("requested");
  const [workStatusFilter, setWorkStatusFilter] =
    useState<WorkStatusFilter>("all");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [viewTarget, setViewTarget] = useState<OrderRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<OrderRecord | null>(null);
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);

  const fetchPage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });
      if (committedSearch) params.set("q", committedSearch);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (workStatusFilter !== "all")
        params.set("workStatus", workStatusFilter);

      const res = await api<ListResponse>(
        `/admin/orders?${params.toString()}`,
      );
      setRows(res.data.rows);
      setTotal(res.data.pagination.total);
      setPages(res.data.pagination.pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
      setRows([]);
      setTotal(0);
      setPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, committedSearch, statusFilter, workStatusFilter]);

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

  const handleStatusFilterChange = (next: StatusFilter) => {
    if (next === statusFilter) return;
    setPage(1);
    setStatusFilter(next);
  };

  const handleWorkStatusFilterChange = (next: WorkStatusFilter) => {
    if (next === workStatusFilter) return;
    setPage(1);
    setWorkStatusFilter(next);
  };

  const patchOrder = async (
    id: string,
    patch: { status?: string; workStatus?: OrderWorkStatus | null },
  ) => {
    setBusyOrderId(id);
    try {
      const res = await api<UpdateResponse>(`/admin/orders/${id}`, {
        method: "PATCH",
        body: patch,
      });
      setRows((list) =>
        list.map((r) => (r.id === id ? res.data.order : r)),
      );
      return res.data.order;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
      return null;
    } finally {
      setBusyOrderId(null);
    }
  };

  const handleAccept = async (order: OrderRecord) => {
    const updated = await patchOrder(order.id, {
      status: "accepted",
      workStatus: "pending",
    });
    if (updated) toast.success(`Accepted ${order.customer.name}'s order`);
  };

  const handleReject = async (order: OrderRecord) => {
    const updated = await patchOrder(order.id, {
      status: "rejected",
      workStatus: null,
    });
    if (updated) toast.success(`Rejected ${order.customer.name}'s order`);
  };

  const handleSetWorkStatus = async (
    order: OrderRecord,
    next: OrderWorkStatus,
  ) => {
    const updated = await patchOrder(order.id, { workStatus: next });
    if (updated) toast.success(`Work marked as ${next}`);
  };

  const handleOrderDeleted = () => {
    setDeleteTarget(null);
    if (rows.length === 1 && page > 1) {
      setPage(page - 1);
    } else {
      fetchPage();
    }
  };

  const hasFilters =
    statusFilter !== "all" ||
    workStatusFilter !== "all" ||
    committedSearch !== "";

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
              placeholder="Search by name, email, phone, service, or city — press Enter"
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

        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={(v) => handleStatusFilterChange(v as StatusFilter)}
          >
            <SelectTrigger className="w-[150px] h-10 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="requested">Requested</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={workStatusFilter}
            onValueChange={(v) =>
              handleWorkStatusFilterChange(v as WorkStatusFilter)
            }
          >
            <SelectTrigger className="w-[150px] h-10 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All work</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="started">Started</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasFilters && (
        <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
          {committedSearch && (
            <span>
              Search:{" "}
              <span className="font-semibold text-foreground">
                “{committedSearch}”
              </span>
            </span>
          )}
          {statusFilter !== "all" && (
            <span>
              Status:{" "}
              <span className="font-semibold text-foreground capitalize">
                {statusFilter}
              </span>
            </span>
          )}
          {workStatusFilter !== "all" && (
            <span>
              Work:{" "}
              <span className="font-semibold text-foreground capitalize">
                {workStatusFilter}
              </span>
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              setCommittedSearch("");
              setStatusFilter("all");
              setWorkStatusFilter("all");
              setPage(1);
            }}
            className="ml-1 underline hover:text-foreground"
          >
            clear all
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

      <OrdersTable
        rows={rows}
        loading={loading}
        emptyLabel={
          hasFilters
            ? "No orders match the current filters."
            : "No orders yet. New bookings will appear here."
        }
        onView={setViewTarget}
        onDelete={setDeleteTarget}
        onAccept={handleAccept}
        onReject={handleReject}
        onSetWorkStatus={handleSetWorkStatus}
        busyOrderId={busyOrderId}
      />

      <Pagination
        page={page}
        pages={pages}
        total={total}
        limit={PAGE_SIZE}
        onPageChange={setPage}
      />

      <ViewOrderModal order={viewTarget} onClose={() => setViewTarget(null)} />
      <DeleteOrderDialog
        order={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={handleOrderDeleted}
      />
    </div>
  );
}
