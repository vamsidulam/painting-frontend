import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  CategoriesPanel,
  CreateServiceModal,
  ServicesPanel,
  type CategoriesPanelHandle,
  type ServicesPanelHandle,
} from "@/components/admin/servicemanagement";

type TabValue = "categories" | "services";

export default function ServiceManagementPage() {
  const servicesRef = useRef<ServicesPanelHandle>(null);
  const categoriesRef = useRef<CategoriesPanelHandle>(null);
  const [tab, setTab] = useState<TabValue>("categories");
  const [createServiceOpen, setCreateServiceOpen] = useState(false);

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
            Manage categories and the services your team can deliver.
          </p>
        </div>
        {tab === "services" && (
          <Button
            type="button"
            onClick={() => setCreateServiceOpen(true)}
            className="gap-2 h-10 rounded-xl"
          >
            <Plus className="h-4 w-4" />
            New Service
          </Button>
        )}
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as TabValue)}
        className="mt-4"
      >
        <TabsList className="rounded-xl">
          <TabsTrigger value="categories" className="rounded-lg">
            Categories
          </TabsTrigger>
          <TabsTrigger value="services" className="rounded-lg">
            Services
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-4">
          <CategoriesPanel ref={categoriesRef} />
        </TabsContent>

        <TabsContent value="services" className="mt-4">
          <ServicesPanel ref={servicesRef} />
        </TabsContent>
      </Tabs>

      <CreateServiceModal
        open={createServiceOpen}
        onOpenChange={setCreateServiceOpen}
        onCreated={() => servicesRef.current?.refetch()}
      />
    </>
  );
}
