export type SitemapType =
  | "pages"
  | "services"
  | "service-locations"
  | "portfolios"
  | "industries"
  | "pricing"
  | "locations"
  | "intelligence"
  | "tools"
  | "customers-ask"
  | "es";

export interface ContentRecord {
  url: string;
  type: SitemapType;
  indexable: boolean;
  firstPublishedAt: string;
  contentUpdatedAt?: string;
  sections?: { id: string; editedAt?: string }[];
}
