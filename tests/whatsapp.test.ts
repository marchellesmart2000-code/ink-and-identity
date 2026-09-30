import { describe, expect, it } from "vitest";
import { enquiryWhatsappMessage, whatsappHref } from "../src/lib/whatsapp";

describe("enquiryWhatsappMessage", () => {
  it("builds a question-and-answer brief with all filled fields", () => {
    const message = enquiryWhatsappMessage({
      brandName: "LEGO God",
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "0821234567",
      customerType: "business",
      needType: "Coffee Mugs",
      productName: "Coffee Mugs",
      quantity: "12",
      brandNotes: "Blue logo on white",
      deadline: "Next Friday",
      budget: "R5000",
      details: "Need gift wrapping",
      fileNames: ["logo.png", "brief.pdf"],
    });

    expect(message).toContain("Hello LEGO God, I would like a quote.");
    expect(message).toContain("Name\nJane Doe");
    expect(message).toContain("Email\njane@example.com");
    expect(message).toContain("Phone\n0821234567");
    expect(message).toContain("Who is this for?\nBusiness");
    expect(message).toContain("Product category\nCoffee Mugs");
    expect(message).not.toContain("Dog tags");
    expect(message).toContain("Quantity\n12");
    expect(message).toContain("Design notes\nBlue logo on white");
    expect(message).toContain("Deadline\nNext Friday");
    expect(message).toContain("Budget\nR5000");
    expect(message).toContain("Anything else\nNeed gift wrapping");
    expect(message).toContain("Artwork to send in this chat\nlogo.png, brief.pdf");
  });

  it("omits empty optional answers", () => {
    const message = enquiryWhatsappMessage({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "",
      customerType: "personal",
      needType: "A custom request",
      productName: "A custom request",
      quantity: "1",
      brandNotes: "",
      deadline: "",
      budget: "",
      details: "",
      fileNames: [],
    });

    expect(message).not.toContain("Phone\n");
    expect(message).not.toContain("Design notes\n");
    expect(message).not.toContain("Artwork to send in this chat\n");
  });
});

describe("whatsappHref", () => {
  it("encodes the full brief in the wa.me link", () => {
    const message = enquiryWhatsappMessage({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "",
      customerType: "personal",
      needType: "A custom request",
      productName: "A custom request",
      quantity: "2",
      brandNotes: "Gold text",
      deadline: "",
      budget: "",
      details: "",
      fileNames: [],
    });
    const href = whatsappHref("083 456 9553", message);

    expect(href).toMatch(/^https:\/\/wa\.me\/27834569553\?text=/);
    expect(decodeURIComponent(new URL(href!).searchParams.get("text")!)).toBe(message);
  });
});
