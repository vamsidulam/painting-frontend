import { motion } from "framer-motion";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPhoneForDisplay, type UserRecord } from "./data";

type Props = {
  rows: UserRecord[];
  onEdit?: (user: UserRecord) => void;
  onDelete?: (user: UserRecord) => void;
  emptyLabel?: string;
  loading?: boolean;
  currentUserId?: string;
};

const roleStyles: Record<UserRecord["role"], string> = {
  admin: "bg-primary/10 text-primary border-primary/30",
  customer: "bg-muted text-muted-foreground border-border",
};

export function UsersTable({
  rows,
  onEdit,
  onDelete,
  emptyLabel = "No users yet.",
  loading = false,
  currentUserId,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl shadow-card border border-border overflow-hidden relative"
    >
      {loading && rows.length > 0 && (
        <div className="absolute inset-0 bg-card/60 backdrop-blur-[1px] grid place-items-center z-10 pointer-events-none">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-semibold">Name</th>
              <th className="px-6 py-3 font-semibold">Email</th>
              <th className="px-6 py-3 font-semibold">Phone</th>
              <th className="px-6 py-3 font-semibold">Role</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-sm text-muted-foreground"
                >
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-sm text-muted-foreground"
                >
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              rows.map((u) => {
                const isSelf = currentUserId === u.id;
                return (
                  <tr
                    key={u.id}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {u.name}
                      {isSelf && (
                        <span className="ml-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                          (you)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-foreground">{u.email}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatPhoneForDisplay(u.phone)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize ${roleStyles[u.role]}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit?.(u)}
                          className="h-8 w-8 p-0"
                          aria-label={`Edit ${u.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete?.(u)}
                          disabled={isSelf}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-40"
                          aria-label={`Delete ${u.name}`}
                          title={
                            isSelf ? "You can't delete your own account" : ""
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
