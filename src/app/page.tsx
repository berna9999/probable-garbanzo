import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Experiences } from "@/components/Experiences";
import { Hero } from "@/components/Hero";
import { MenuSection } from "@/components/MenuSection";
import { Reviews } from "@/components/Reviews";
import { getBookingLink } from "@/lib/booking";
import { restaurant } from "@/lib/config";
import { toLocaleTag } from "@/lib/format";
import { getNavLinks } from "@/lib/sections";
import type { SectionKey } from "@/types/restaurant";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const r = restaurant;
  const locale = toLocaleTag(r.meta.locale);
  const booking = getBookingLink(r);
  const firstSection = getNavLinks(r)[0]?.href;

  // L'ordine delle sezioni è definito in layout.order; ogni componente si auto-esclude se disattivato o vuoto.
  const sections: Record<SectionKey, () => ReactNode> = {
    hero: () => <Hero data={r.hero} booking={booking} nextSectionHref={firstSection} labels={r.labels} />,
    about: () => <About data={r.about} />,
    menu: () => <MenuSection data={r.menu} locale={locale} labels={r.labels} />,
    experiences: () => (
      <Experiences data={r.experiences} booking={booking} locale={locale} currency={r.menu.currency} />
    ),
    reviews: () => <Reviews data={r.reviews} locale={locale} labels={r.labels} />,
    contact: () => (
      <Contact
        data={r.contactSection}
        contact={r.contact}
        hours={r.hours}
        booking={r.booking}
        bookingLink={booking}
        labels={r.labels}
      />
    ),
  };

  return (
    <>
      {r.layout.order.map((key) => (
        <Fragment key={key}>{sections[key]?.()}</Fragment>
      ))}
    </>
  );
}
