import { FC, ReactNode } from "react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "../docs/layout.config";
import Image from "next/image";
import icon from "../../public/favicon/icon.svg";
import Link from "next/link";

import xIcon from "./logos/x.svg";
import githubIcon from "./logos/github.svg";
import discordIcon from "./logos/discord.svg";

export default function Layout({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <HomeLayout {...baseOptions}>
      {children}
      <Footer />
    </HomeLayout>
  );
}

function Footer(): React.ReactElement {
  return (
    <footer className="relative border-t px-8 pt-20 pb-32">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col justify-between sm:flex-row">
        <div className="mr-4 flex flex-col gap-4">
          <Link
            className="mr-4 flex items-center gap-3 text-sm font-normal text-black"
            href="/"
          >
            <Image
              src={icon}
              alt="logo"
              className="inline size-7 dark:hue-rotate-180 dark:invert"
            />
            <span className="text-2xl font-medium text-black dark:text-white">
              Portal-chatui
            </span>
          </Link>
          <div className="flex gap-4">
            <Link href="https://www.portalos.ru" target="_blank">
              <Image
                src={xIcon}
                alt="X icon"
                className="inline size-5 opacity-30 transition-opacity hover:opacity-100 dark:hue-rotate-180 dark:invert"
              />
            </Link>
            <Link href="https://www.portalos.ru" target="_blank">
              <Image
                src={githubIcon}
                alt="GitHub icon"
                className="inline size-5 opacity-30 transition-opacity hover:opacity-100 dark:hue-rotate-180 dark:invert"
              />
            </Link>
            <Link href="https://www.portalos.ru" target="_blank">
              <Image
                src={discordIcon}
                alt="Discord icon"
                className="inline size-5 opacity-30 transition-opacity hover:opacity-100 dark:hue-rotate-180 dark:invert"
              />
            </Link>
          </div>
          <div className="flex-grow" />
          <p className="text-sm text-foreground/30">
            &copy; {new Date().getFullYear()} АО Портал.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 items-start gap-10 sm:mt-0">
          <div className="flex w-[160px] flex-col justify-center gap-4">
            <p className="text-sm">Решение</p>
            <FooterLink href="/docs/getting-started">Документация</FooterLink>
            <FooterLink href="/showcase">Витрина</FooterLink>
            <FooterLink href="/examples">Примеры</FooterLink>
            <FooterLink href="/pricing">Цены</FooterLink>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <p className="text-sm">О компании</p>
            <FooterLink href="https://www.portalos.ru">
              Контакты
            </FooterLink>
            <FooterLink href="/blog">Блог</FooterLink>
            <FooterLink href="https://www.portalos.ru">
              Условия сервиса
            </FooterLink>
            <FooterLink href="https://www.portalos.ru">
              Политика конфиденциальности
            </FooterLink>
          </div>

          {/* <div className="mt-4 flex flex-col justify-center space-y-4">
            <a
              className="text-muted-foreground hover:text-foreground text-xs transition-colors sm:text-sm"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-muted-foreground hover:text-foreground text-xs transition-colors sm:text-sm"
              href="#"
            >
              Terms of Service
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  );
}

const FooterLink: FC<{ href: string; children: ReactNode }> = ({
  href,
  children,
}) => {
  return (
    <a
      className="text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
      href={href}
    >
      {children}
    </a>
  );
};
