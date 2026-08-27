import { describe, expect, it } from "vitest";
import { isCampaignLive, validateQuoteRequest } from "../../convex/lib/quoteValidation";

describe("validateQuoteRequest", () => {
  const valid = {
    name: "Amelia",
    email: "amelia@example.com",
    customerType: "personal",
    needType: "gifts",
    consent: true,
    lines: [{ label: "Mug", quantity: 2 }],
  };

  it("accepts a complete enquiry", () => {
    expect(validateQuoteRequest(valid)).toEqual({ ok: true, spam: false });
  });

  it("rejects a missing name", () => {
    expect(validateQuoteRequest({ ...valid, name: "A" })).toEqual({
      ok: false,
      error: "Please share your name.",
    });
  });

  it("rejects an invalid email", () => {
    expect(validateQuoteRequest({ ...valid, email: "not-an-email" }).ok).toBe(false);
  });

  it("requires consent", () => {
    expect(validateQuoteRequest({ ...valid, consent: false }).ok).toBe(false);
  });

  it("flags honeypot submissions as spam without throwing", () => {
    expect(validateQuoteRequest({ ...valid, honeypot: "http://spam.test" })).toEqual({
      ok: true,
      spam: true,
    });
  });

  it("rejects oversized artwork", () => {
    const result = validateQuoteRequest({
      ...valid,
      files: [{ contentType: "image/png", size: 11 * 1024 * 1024 }],
    });
    expect(result.ok).toBe(false);
  });

  it("rejects disallowed artwork types", () => {
    const result = validateQuoteRequest({
      ...valid,
      files: [{ contentType: "application/x-msdownload", size: 100 }],
    });
    expect(result.ok).toBe(false);
  });
});

describe("isCampaignLive", () => {
  it("hides campaigns after the end date", () => {
    expect(isCampaignLive(1, 10, 11)).toBe(false);
  });

  it("hides campaigns before the start date", () => {
    expect(isCampaignLive(20, 30, 11)).toBe(false);
  });

  it("shows campaigns inside the window", () => {
    expect(isCampaignLive(1, 30, 11)).toBe(true);
  });
});
