import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CreateServiceModal,
  ServicesPanel,
  type ServicesPanelHandle,
} from "@/components/admin/servicemanagement";

export default function ServiceManagementPage() {
  const panelRef = useRef<ServicesPanelHandle>(null);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    document.title = "Services — Brushly";
  }, []);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground">
            Services
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage the painting services your team can deliver.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="gap-2 h-10 rounded-xl"
        >
          <Plus className="h-4 w-4" />
          New Service
        </Button>
      </div>

      <ServicesPanel ref={panelRef} />

      <CreateServiceModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={() => panelRef.current?.refetch()}
      />
    </>
  );
}
