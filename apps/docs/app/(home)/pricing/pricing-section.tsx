import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShineBorder } from "@/components/magicui/shine-border";
import Link from "next/link";

const pricingOptions = [
  {
    title: "Бесплатно",
    price: "Up to 200 MAU",
    features: ["200 MAU", "Истории чатов", "Управление разветвлениями"],
    button: "Выбрать",
    buttonLink: "https://www.portalos.ru",
  },
  {
    title: "Профессиональный",
    price: "$50/Месяц",
    features: [
      "500 MAU + $0.10 per additional",
      "Истории чатов",
      "Управление разветвлениями",
      "Ранний доступ к новым функциям",
    ],
    button: "Выбрать",
    buttonLink: "https://www.portalos.ru",
  },
  {
    title: "Корпоративный",
    price: "Обсуждаемая цена",
    features: [
      "Интеграция с вашей инфраструктурой",
      "Хранение приобретение базы данных в вашей инфраструктуре",
      "Выделенная поддержка",
      "99.99% Uptime по SLA",
      "Развёртывания по запросу",
      "Юридическая и правовое сопровождение",
    ],
    button: "Выбрать",
    buttonLink: "https://www.portalos.ru",
  },
];

export default function PricingSection() {
  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {pricingOptions.map((option) => {
          const isPro = option.title === "Pro";
          const content = (
            <>
              <div className="flex-grow">
                <h3 className="mb-2 text-2xl font-semibold">{option.title}</h3>
                <p className="text-md mb-4">{option.price}</p>
                <ul className="mb-6 space-y-2 text-sm">
                  {option.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckIcon className="mt-0.5 mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                className="mt-auto w-full"
                variant={isPro ? "default" : "outline"}
                asChild
              >
                <Link href={option.buttonLink}>{option.button}</Link>
              </Button>
            </>
          );

          if (isPro) {
            return (
              <ShineBorder
                key={option.title}
                className={"relative flex flex-col border-0 p-6"}
                borderRadius={8}
                color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
              >
                {content}
              </ShineBorder>
            );
          }

          return (
            <div
              key={option.title}
              className="relative flex flex-col rounded-lg border-2 p-6"
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
