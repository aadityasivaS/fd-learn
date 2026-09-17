import { SiteShell } from "@/components/site-shell";
import { ToolWorkspace } from "@/components/tool-workspace";
export default function CanonicalCoverPage() {
  return (
    <SiteShell>
      <ToolWorkspace kind="cover" />
    </SiteShell>
  );
}
