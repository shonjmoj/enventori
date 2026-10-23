import { describe, expect, it } from "vitest";
import { buildTheme, contrast, INK, WHITE } from "./theme";

describe("buildTheme", () => {
  it("dark primary: used for actions as is", () => {
    const theme = buildTheme({ primary: "#111111", secondary: "#FFFFFF" });
    expect(theme.action).toBe("#111111");
    expect(theme.onAction).toBe(WHITE);
    expect(theme.actionInverse).toBe("#ffffff"); // black can't stand on a dark photo
  });

  it("pale primary: surface only, actions use the secondary", () => {
    const theme = buildTheme({ primary: "#A7D8F0", secondary: "#0B1F3A" });
    expect(theme.brand).toBe("#a7d8f0");
    expect(theme.onBrand).toBe("#0b1f3a");
    expect(theme.action).toBe("#0b1f3a");
    expect(theme.actionInverse).toBe("#a7d8f0");
  });

  it("neon primary without secondary: actions fall back to ink", () => {
    const theme = buildTheme({ primary: "#C6FF00", secondary: null });
    expect(theme.action).toBe(INK);
    expect(theme.onBrand).toBe(INK);
    expect(theme.actionInverse).toBe("#c6ff00");
  });

  it("no usable colour at all still yields a legible theme", () => {
    const theme = buildTheme({ primary: null, secondary: null });
    expect(contrast(theme.brand, theme.onBrand)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(theme.action, theme.onAction)).toBeGreaterThanOrEqual(4.5);
  });
});
