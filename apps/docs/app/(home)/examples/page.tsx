import Image from "next/image";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ShowcaseItem = {
  title: string;
  description?: string;
  image: string;
  link: string;
};

const EXAMPLE_ITEMS: ShowcaseItem[] = [
  {
    title: "Modal",
    image: "/screenshot/examples/modal.png",
    description: "Floating button that opens an AI assistant chat box.",
    link: "/examples/modal",
  },
  {
    title: "Form Filling Co-Pilot",
    image: "/screenshot/examples/form-demo.png",
    description: "AssistantSidebar copilot which fills forms for the user.",
    link: "/examples/form-demo",
  },
  {
    title: "Клон ChatGPT",
    image: "/screenshot/examples/chatgpt.png",
    description: "Аналог интерфейса нейросети ChatGPT",
    link: "/examples/chatgpt",
  },
  {
    title: "Клон Claude",
    image: "/screenshot/examples/claude.png",
    description: "Аналог интерфейса нейросети Claude",
    link: "/examples/claude",
  },
  {
    title: "Клон Perplexity",
    image: "/screenshot/examples/chatgpt.png",
    description: "Аналог интерфейса проекта Perplexity",
    link: "/examples/perplexity",
  },
  {
    title: "AI",
    image: "/screenshot/examples/ai-sdk.png",
    description: "Конфигурируемые интерфейсы Чатов",
    link: "/examples/ai-sdk",
  },
  {
    title: "Агент с постоянной памятью и навыками",
    image: "/screenshot/examples/mem0.png",
    description:
      "Персонализированный агент с постоянной памятью и навыками.",
    link: "/examples/mem0",
  },
  {
    title: "Stockbroker",
    image: "/screenshot/stockbroker.png",
    description: "Агент помогающий человеку в выборе решений по акциям",
    link: "/examples/stockbroker",
  },
  {
    title: "Артефакты",
    image: "/screenshot/examples/artifacts.png",
    description:
      "Аналог Claude Artifacts. Да можете просить агента создавать сайты.",
    link: "/examples/artifacts",
  },
  {
    title: "Open Canvas",
    image: "/screenshot/open-canvas.png",
    description: "Аналог ChatGPT's Canvas.",
    link: "https://github.com/langchain-ai/open-canvas",
  },
  {
    title: "FastAPI",
    image: "/screenshot/examples/fastapi-langgraph.png",
    description:
      "Интеграция с FastAPI",
    link: "https://github.com/Yonom/assistant-ui-langgraph-fastapi",
  },
];

export default function Component() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mt-12 mb-28 text-center">
          <h1 className="mt-4 text-5xl font-bold">Examples</h1>
        </header>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EXAMPLE_ITEMS.map((item) => (
            <ShowcaseCard key={item.title} {...item} />
          ))}
        </div>

        <div className="my-20 flex flex-col items-center gap-6">
          <h2 className="text-4xl font-bold">Ищите больше примеров?</h2>
          <Button asChild>
            <a href="/showcase">Посмотрите также на примеры сообщества!</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ShowcaseCard({ title, image, description, link }: ShowcaseItem) {
  return (
    <Link href={link}>
      <Card className="group relative flex max-h-[400px] flex-col overflow-hidden rounded-lg bg-card">
        <div className="overflow-hidden">
          <Image
            src={image}
            alt={title}
            width={600}
            height={400}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col gap-1 p-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <div className="flex-1">
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
