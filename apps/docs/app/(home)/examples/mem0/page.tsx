export default function Component() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mt-12 mb-8 text-center">
          <h1 className="mt-4 text-5xl font-bold">
            Realtime-агент с постоянной памятью и навыками
          </h1>
        </header>

        <div className="h-[700px]">
          <iframe
            title="Агент с постоянной памятью"
            className="h-full w-full border border-gray-200"
            src="https://chat.portalos.ru/"
          />
        </div>
      </div>
    </div>
  );
}
