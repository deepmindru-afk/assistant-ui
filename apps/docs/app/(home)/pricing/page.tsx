import PricingSection from "./pricing-section";
import OpenSourceCard from "./open-source-card";

export default function PricingPage() {
  return (
    <div className="min-h-screen py-12">
      <main className="container mx-auto px-4">
        <h1 className="mb-12 text-center text-4xl font-bold">Цены</h1>

        <div className="mx-auto mb-6 w-full max-w-[1000px]">
          <h2 className="mb-2 text-2xl font-bold">Портал</h2>
          <p className="text-lg">
            Полностью не требующая вашему управления облачная инфраструктура для агентов на основе искусственного интеллекта
          </p>
        </div>

        <PricingSection />

        <div className="mx-auto mb-6 w-full max-w-[1000px]">
          <h2 className="mt-4 mb-2 text-2xl font-bold">PortalOS</h2>
          <p className="text-lg">Инфраструктура для создания и управления агентами на основе искусственного интеллекта</p>
        </div>
        <OpenSourceCard />

        <p className="mx-auto mt-4 mb-4 w-full max-w-[1000px] text-xs text-muted-foreground">
          <strong>*MAU:</strong> Monthly Active Users who send at least one
          message via assistant-ui. Are you a B2C app?{" "}
          <a href="mailto:portal@portalos.ru" className="underline">
            Свяжитесь с нами
          </a>{" "}
          для получения специальных условий.
        </p>
      </main>
    </div>
  );
}
