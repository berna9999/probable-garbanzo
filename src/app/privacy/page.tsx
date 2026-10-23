import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { restaurant } from "@/lib/config";
import { toLocaleTag } from "@/lib/format";
import { legalVars } from "@/lib/seo";

export const metadata: Metadata = {
  title: restaurant.legal.privacy.title,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      doc={restaurant.legal.privacy}
      vars={legalVars(restaurant)}
      locale={toLocaleTag(restaurant.meta.locale)}
      labels={restaurant.labels}
    />
  );
}
