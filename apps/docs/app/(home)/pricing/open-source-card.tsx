import { CheckIcon, GithubIcon } from "lucide-react";

export default function OpenSourceCard() {
  return (
    <div className="mx-auto mb-12 w-full max-w-[1000px]">
      <div className="flex flex-col rounded-lg border-2 p-6">
        <div className="flex-grow">
          <div className="mb-4 flex gap-3">
            <GithubIcon className="h-6 w-6" />
            <h3 className="text-xl font-semibold">
              Открытый и свободный код
            </h3>
          </div>
          <p className="text-md mb-4">
            Компоненты для ваших ИИ-приложений
          </p>
          <ul className="space-y-2 text-sm">
            {[
              "ИИ-агенты",
              "Визуальные и аудио интерфейсы",
              "Интеграции с внешними системами",
            ].map((feature) => (
              <li key={feature} className="flex items-start">
                <CheckIcon className="mt-0.5 mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
