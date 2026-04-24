import { useEffect } from "react";
import { ProjectsPanel } from "@/components/admin/projectmanagement";

export default function ProjectManagementPage() {
  useEffect(() => {
    document.title = "PaintBrush";
  }, []);

  return (
    <>
      <div>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground">
          Projects
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage the projects shown on the public site.
        </p>
      </div>

      <div className="mt-6">
        <ProjectsPanel />
      </div>
    </>
  );
}
