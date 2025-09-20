import { DocsRuntimeProvider } from "../../DocsRuntimeProvider";
import { Claude } from "@/components/claude/Claude";

export default function Component() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mt-12 mb-28 text-center">
          <h1 className="mt-4 text-5xl font-bold">Клон Claude</h1>
        </header>

        <div className="h-[700px]">
          <DocsRuntimeProvider>
            <Claude />
          </DocsRuntimeProvider>
        </div>
      </div>
    </div>
  );
}
