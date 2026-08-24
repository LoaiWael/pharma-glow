import { useLayoutEffect } from "react";
import { IntlProvider } from "react-intl";
import { Outlet, useParams } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_DIR,
  type Locale,
} from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";
import { Footer } from "@/layout/Footer";
import { Header } from "@/layout/Header";

type RootLayoutProps = {
  forcedLocale?: Locale;
};

export const RootLayout = ({ forcedLocale }: RootLayoutProps) => {
  const { locale: paramLocale } = useParams();
  const activeLocale: Locale =
    forcedLocale || (isLocale(paramLocale) ? paramLocale : DEFAULT_LOCALE);

  useLayoutEffect(() => {
    document.documentElement.lang = activeLocale;
    document.documentElement.dir = LOCALE_DIR[activeLocale];
  }, [activeLocale]);

  const direction = LOCALE_DIR[activeLocale];

  return (
    <IntlProvider
      defaultLocale={DEFAULT_LOCALE}
      locale={activeLocale}
      messages={getMessages(activeLocale)}
    >
      <div className="flex min-h-svh flex-col overflow-x-clip bg-background text-foreground">
        <Header />
        <div className="page-shell flex min-h-svh flex-col">
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
        <Footer />
        <Toaster
          dir={direction}
          position="top-center"
          richColors
          closeButton
        />
      </div>
    </IntlProvider>
  );
};
