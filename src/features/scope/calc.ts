export type RoomStatus = "essential" | "later" | "none";
export type FlatAge = "<5" | "5-15" | "15+";
export type Tier = "Basic" | "Standard" | "Premium";
export type KitchenOption = "cosmetic" | "modular" | "gut";

export interface Room {
  id: string;
  name: string;
  desc: string;
  weight: number;
  items: number;
  status: RoomStatus;
}

export const RATE_PER_SQFT = 1750;
export const LATER_DEDUCTION = 0.18;
export const BUFFER: Record<FlatAge, number> = { "<5": 0.05, "5-15": 0.15, "15+": 0.25 };
export const TIER_MULT: Record<Tier, number> = { Basic: 0.85, Standard: 1, Premium: 1.3 };
export const KITCHEN_MULT: Record<KitchenOption, number> = { cosmetic: 0.5, modular: 1, gut: 1.4 };

export const DEFAULT_ROOMS: Room[] = [
  { id: "living", name: "Living & Dining", desc: "Perimeter false ceiling, fresh paint, LED cove", weight: 0.22, items: 5, status: "essential" },
  { id: "kitchen", name: "Modular Kitchen", desc: "L-shape BWP marine ply cabinets, quartz counter", weight: 0.25, items: 5, status: "essential" },
  { id: "master", name: "Master Bedroom", desc: "Sliding wardrobe, bedside panelling", weight: 0.18, items: 3, status: "essential" },
  { id: "bed2", name: "Bedroom 2", desc: "Repaint & study unit", weight: 0.1, items: 2, status: "essential" },
  { id: "bath", name: "Bathrooms", desc: "Sanitaryware replacement & waterproofing", weight: 0.18, items: 2, status: "essential" },
  { id: "balcony", name: "Balcony", desc: "Weatherproof paint & railing check", weight: 0.07, items: 1, status: "essential" },
];

export function computeBudget(opts: {
  carpetArea: number;
  flatAge: FlatAge;
  rooms: Room[];
  kitchenTier: Tier;
  kitchenOption: KitchenOption;
}) {
  const base = opts.carpetArea * RATE_PER_SQFT;
  let essential = 0;
  let deferred = 0;
  for (const r of opts.rooms) {
    let v = base * r.weight;
    if (r.id === "kitchen") v *= TIER_MULT[opts.kitchenTier] * KITCHEN_MULT[opts.kitchenOption];
    if (r.status === "essential") essential += v;
    else if (r.status === "later") {
      // Later rooms are deducted from essential and parked in Phase 2
      deferred += v;
    }
  }
  const bufferPct = BUFFER[opts.flatAge];
  const buffer = essential * bufferPct;
  const low = essential * 0.95 + buffer;
  const high = essential * 1.15 + buffer;
  const total = essential + deferred + buffer || 1;
  return {
    base,
    essential,
    deferred,
    buffer,
    bufferPct,
    low,
    high,
    essLow: essential * 0.95,
    essHigh: essential * 1.15,
    share: {
      essential: Math.round((essential / total) * 100),
      deferred: Math.round((deferred / total) * 100),
      buffer: Math.round((buffer / total) * 100),
    },
  };
}

export function formatLakh(n: number) {
  return `₹${(n / 100000).toFixed(1)}L`;
}
