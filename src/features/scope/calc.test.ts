import { describe, it, expect } from "vitest";
import { computeBudget, DEFAULT_ROOMS } from "./calc";

const base = { carpetArea: 750, flatAge: "5-15" as const, rooms: DEFAULT_ROOMS, kitchenTier: "Standard" as const, kitchenOption: "modular" as const };

describe("budget engine", () => {
  it("base is carpet area × ₹1,750", () => {
    expect(computeBudget(base).base).toBe(1312500);
  });
  it("5–15 yr flat adds 15% buffer", () => {
    const b = computeBudget(base);
    expect(b.buffer).toBeCloseTo(b.essential * 0.15);
  });
  it("15+ yr flat adds 25% buffer", () => {
    const b = computeBudget({ ...base, flatAge: "15+" });
    expect(b.bufferPct).toBe(0.25);
  });
  it("range is essential ×0.95 to ×1.15 plus buffer", () => {
    const b = computeBudget(base);
    expect(b.low).toBeCloseTo(b.essential * 0.95 + b.buffer);
    expect(b.high).toBeCloseTo(b.essential * 1.15 + b.buffer);
  });
  it("later rooms move out of essential into deferred", () => {
    const rooms = DEFAULT_ROOMS.map((r) => (r.id === "balcony" ? { ...r, status: "later" as const } : r));
    const b = computeBudget({ ...base, rooms });
    expect(b.deferred).toBeCloseTo(1312500 * 0.07);
    expect(b.essential).toBeCloseTo(1312500 * 0.93);
  });
});
