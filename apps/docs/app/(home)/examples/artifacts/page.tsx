export default function Component() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mt-12 mb-28 text-center">
          <h1 className="mt-4 text-5xl font-bold">Artifacts в чате</h1>
        </header>

        <div className="h-[700px]">
          <iframe
            title="Artifacts в чате"
            className="h-full w-full border-none"
            src="https://assistant-ui-artifacts.vercel.app/"
          />
        </div>
      </div>
    </div>
  );
}
