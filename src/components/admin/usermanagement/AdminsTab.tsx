import { useRef, useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UsersPanel, type UsersPanelHandle } from "./UsersPanel";
import { OnboardAdminModal } from "./OnboardAdminModal";

export function AdminsTab() {
  const panelRef = useRef<UsersPanelHandle>(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <UsersPanel
        ref={panelRef}
        role="admin"
        title="Admins"
        description="Team members with full access to the admin console."
        headerAction={
          <Button
            type="button"
            onClick={() => setModalOpen(true)}
            className="gap-2 h-10 rounded-xl"
          >
            <UserPlus className="h-4 w-4" />
            Onboard Admin
          </Button>
        }
      />

      <OnboardAdminModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => panelRef.current?.refetch()}
      />
    </>
  );
}
