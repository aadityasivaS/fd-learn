import { SiteShell } from "@/components/site-shell";
import { ToolWorkspace } from "@/components/tool-workspace";
export default function ClosurePage() {
  return (
    <SiteShell>
      <ToolWorkspace kind="closure" />
    </SiteShell>
  );
}
