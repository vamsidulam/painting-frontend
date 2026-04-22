import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AdminsTab,
  CustomersTab,
} from "@/components/admin/usermanagement";

export default function UserManagementPage() {
  useEffect(() => {
    document.title = "User Management — Brushly";
  }, []);

  return (
    <>
      <div>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground">
          User Management
        </h1>
       
      </div>

      <Tabs defaultValue="admins" className="w-full">
        <TabsList className="h-10 p-1">
          <TabsTrigger value="admins" className="px-4 text-sm">
            Admins
          </TabsTrigger>
          <TabsTrigger value="customers" className="px-4 text-sm">
            Customers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admins" className="mt-6">
          <AdminsTab />
        </TabsContent>
        <TabsContent value="customers" className="mt-6">
          <CustomersTab />
        </TabsContent>
      </Tabs>
    </>
  );
}
