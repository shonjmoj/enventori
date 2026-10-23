import { describe, expect, it } from "vitest";
import { clubHref } from "./page-context";

describe("clubHref", () => {
  it("scopes site-relative links to the club", () => {
    expect(clubHref("rivemont", "/evenement/178")).toBe("/rivemont/evenement/178");
    expect(clubHref("rivemont", "/")).toBe("/rivemont");
  });

  it("leaves absolute URLs and anchors alone", () => {
    expect(clubHref("rivemont", "https://example.com/rivemont")).toBe("https://example.com/rivemont");
    expect(clubHref("rivemont", "//cdn.example.com/x")).toBe("//cdn.example.com/x");
    expect(clubHref("rivemont", "#dates")).toBe("#dates");
  });
});
