import { describe, it, expect } from "bun:test";
import { lastmodFor, buildSitemaps, type ContentRecord } from "../src/index";

describe("seo-sitemap lastmod contract", () => {
  it("rejects future lastmod (the 2026-11-24 incident)", () => {
    const bad: ContentRecord = {
      url: "https://aimarketingagency.services/services/",
      type: "services",
      indexable: true,
      firstPublishedAt: "2026-11-24",
    };
    expect(() => lastmodFor(bad, new Date("2026-11-23T12:00:00Z"))).toThrow(
      /FUTURE_LASTMOD/,
    );
  });

  it("throws BAD_LASTMOD on unparsable dates", () => {
    const bad: ContentRecord = {
      url: "https://websitedesign.business/services/website-audit/",
      type: "services",
      indexable: true,
      firstPublishedAt: "2026-99-99",
    };
    expect(() => lastmodFor(bad, new Date("2026-11-24T12:00:00Z"))).toThrow(
      /BAD_LASTMOD/,
    );
  });

  it("omits lastmod rather than inventing one", () => {
    const r: ContentRecord = {
      url: "https://websitedesign.business/",
      type: "pages",
      indexable: true,
      firstPublishedAt: "",
    };
    expect(lastmodFor(r, new Date("2026-11-24T12:00:00Z"))).toBeNull();
  });

  it("prefers contentUpdatedAt over section editedAt and firstPublishedAt", () => {
    expect(
      lastmodFor(
        {
          url: "https://websitedesign.business/services/website-audit/",
          type: "services",
          indexable: true,
          firstPublishedAt: "2026-11-22",
          sections: [{ id: "why-choose", editedAt: "2026-11-23" }],
          contentUpdatedAt: "2026-11-24",
        },
        new Date("2026-11-24T12:00:00Z"),
      ),
    ).toBe("2026-11-24");
  });

  it("buildSitemaps emits truthful lastmod XML and excludes non-indexable records", () => {
    const files = buildSitemaps(
      "websitedesign.business",
      [
        {
          url: "https://websitedesign.business/services/website-audit/",
          type: "services",
          indexable: true,
          firstPublishedAt: "2026-11-23",
          contentUpdatedAt: "2026-11-24",
        },
        {
          url: "https://websitedesign.business/draft/",
          type: "pages",
          indexable: false,
          firstPublishedAt: "2026-11-24",
        },
      ],
      new Date("2026-11-24T12:00:00Z"),
    );
    expect(files["sitemap-services.xml"]).toContain("<lastmod>2026-11-24</lastmod>");
    expect(files["sitemap-pages.xml"]).toBeUndefined();
    expect(files["sitemap.xml"]).toContain(
      "https://websitedesign.business/sitemap-services.xml",
    );
  });
});
