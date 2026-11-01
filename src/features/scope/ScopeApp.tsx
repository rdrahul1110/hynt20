import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft, ArrowRight, Home, Compass, Plus, CalendarDays, User, MapPin, Check, Minus, Pencil,
  Info, Star, ShieldCheck, Upload, FileText, Download, X, Clock, Sofa, ChefHat,
  BedDouble, Bath, Fence, Ruler, Hammer, Paintbrush, Building2, Sparkles, Lock, Loader2,
} from "lucide-react";
import {
  computeBudget, DEFAULT_ROOMS, formatLakh, type FlatAge, type KitchenOption, type Room, type RoomStatus, type Tier,
} from "./calc";

type Step = "home" | "snapshot" | "rooms" | "budget" | "pros" | "inbox" | "compare" | "contract";
const ROOM_ICONS: Record<string, typeof Sofa> = { living: Sofa, kitchen: ChefHat, master: BedDouble, bed2: BedDouble, bath: Bath, balcony: Fence };
const WEEKS: Record<string, number> = { "<4": 4, "4-8": 8, "8-12": 12 };

function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: ReactNode }) {
  return <button onClick={onClick} data-active={!!active} className="chip">{children}</button>;
}
function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="sticky top-0 z-20 flex items-center gap-3 border-b bg-card/95 px-4 py-3 backdrop-blur">
      <button onClick={onBack} aria-label="Back" className="rounded-full p-1.5 hover:bg-muted"><ArrowLeft className="h-5 w-5" /></button>
      <h1 className="text-base font-bold">{title}</h1>
    </div>
  );
}
function Label({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{children}</p>;
}

export function ScopeApp() {
  const [step, setStep] = useState<Step>("home");
  const [bhk, setBhk] = useState<"2BHK" | "3BHK" | "Other">("2BHK");
  const [ptype, setPtype] = useState<"Resale" | "New">("Resale");
  const [area, setArea] = useState(750);
  const [age, setAge] = useState<FlatAge>("5-15");
  const [moveIn, setMoveIn] = useState("4-8");
  const [rooms, setRooms] = useState<Room[]>(DEFAULT_ROOMS);
  const [tier, setTier] = useState<Tier>("Standard");
  const [kOpt, setKOpt] = useState<KitchenOption>("modular");
  const [sheet, setSheet] = useState(false);
  const [draft, setDraft] = useState<{ tier: Tier; opt: KitchenOption }>({ tier, opt: kOpt });
  const [otp, setOtp] = useState(false);
  const [upload, setUpload] = useState<"idle" | "loading" | "done">("idle");
  const [diffOnly, setDiffOnly] = useState(true);
  const [kickoff, setKickoff] = useState(false);
  const [active, setActive] = useState(false);

  const weeks = WEEKS[moveIn] ?? 8;
  const b = useMemo(() => computeBudget({ carpetArea: area, flatAge: age, rooms, kitchenTier: tier, kitchenOption: kOpt }), [area, age, rooms, tier, kOpt]);
  const essRooms = rooms.filter((r) => r.status === "essential");
  const essItems = essRooms.reduce((s, r) => s + r.items, 0) + (age === "<5" ? 0 : 4);
  const estWeeks = Math.max(2, Math.round(essRooms.reduce((s, r) => s + r.weight, 0) * 5.5));
  const ageYears = age === "<5" ? 3 : age === "5-15" ? 12 : 18;
  const go = (s: Step) => { setStep(s); window.scrollTo(0, 0); };
  const setStatus = (id: string, status: RoomStatus) => setRooms((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));

  let body: ReactNode;
  if (step === "home") {
    body = (
      <div>
        <div className="bg-gradient-brand px-5 pb-16 pt-8 text-brand-foreground">
          <p className="text-xs font-semibold tracking-widest opacity-80">HYNT</p>
          <h1 className="mt-1 text-2xl font-extrabold leading-tight">India's Home App</h1>
          <p className="text-sm opacity-90">Discover. Connect. Manage.</p>
        </div>
        <div className="-mt-10 space-y-5 px-4">
          {active && (
            <div className="card-surface border-brand p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-brand-strong">ACTIVE PROJECT</p>
                <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand-strong">On track</span>
              </div>
              <p className="mt-1 font-bold">{bhk} Renovation · Apex Living Studio</p>
              <p className="text-xs text-muted-foreground">Mobilization Oct 25 · Tranche 1 of 4 · ₹13.80L</p>
              <div className="mt-3 h-2 rounded-full bg-muted"><div className="h-2 w-[8%] rounded-full bg-brand" /></div>
            </div>
          )}
          <div className="card-surface p-5">
            <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand-strong"><Sparkles className="h-3 w-3" /> Scope Compass</div>
            <h2 className="text-lg font-bold leading-snug">Planning a Home Renovation?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Get a verified, room-by-room Scope Brief and calibrated budget in 3 minutes before talking to contractors.</p>
            <button className="btn-ink mt-4" onClick={() => go("snapshot")}>Plan Your Scope Brief <ArrowRight className="h-4 w-4" /></button>
          </div>
          <div>
            <h3 className="mb-3 font-bold">Categories</h3>
            <div className="grid grid-cols-4 gap-3">
              {[[Paintbrush, "Interior Design"], [Building2, "Architecture"], [ChefHat, "Modular"], [Hammer, "Civil Work"], [Bath, "Plumbing"], [Ruler, "Carpentry"], [Sofa, "Furniture"], [Fence, "Exteriors"]].map(([I, l]) => {
                const Ic = I as typeof Sofa;
                return (
                  <div key={l as string} className="flex flex-col items-center gap-1.5 text-center">
                    <div className="card-surface flex h-14 w-14 items-center justify-center"><Ic className="h-6 w-6 text-brand-strong" /></div>
                    <span className="text-[10px] font-medium leading-tight">{l as string}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="mb-3 font-bold">Featured Events</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[["Nov 8", "Modular Kitchen Masterclass", "Andheri West"], ["Nov 15", "First-Home Buyer Meetup", "Bandra"], ["Nov 22", "Waterproofing 101", "Online"]].map(([d, t, p]) => (
                <div key={t} className="card-surface min-w-[200px] p-4">
                  <p className="text-xs font-semibold text-brand-strong">{d}</p>
                  <p className="mt-1 text-sm font-bold">{t}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (step === "snapshot") {
    body = (
      <div>
        <Header title="Your Flat Snapshot" onBack={() => go("home")} />
        <div className="space-y-6 p-4">
          <div>
            <Label>Pincode</Label>
            <div className="card-surface flex items-center justify-between p-3">
              <input defaultValue="400053" className="w-24 bg-transparent font-semibold outline-none" />
              <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-strong">Mumbai · Andheri West ✓</span>
            </div>
          </div>
          <div>
            <Label>Flat size</Label>
            <div className="flex gap-2">
              {(["2BHK", "3BHK", "Other"] as const).map((x) => (
                <Chip key={x} active={bhk === x} onClick={() => { setBhk(x); if (x !== "Other") setArea(x === "2BHK" ? 750 : 1050); }}>{x}</Chip>
              ))}
            </div>
          </div>
          <div>
            <Label>Property type</Label>
            <div className="flex gap-2">
              <Chip active={ptype === "Resale"} onClick={() => setPtype("Resale")}>Resale Flat</Chip>
              <Chip active={ptype === "New"} onClick={() => setPtype("New")}>Brand New</Chip>
            </div>
          </div>
          <div>
            <Label>Carpet area</Label>
            <div className="card-surface flex items-center justify-between p-2">
              <button aria-label="Decrease" onClick={() => setArea((a) => Math.max(300, a - 25))} className="rounded-full bg-muted p-2.5"><Minus className="h-4 w-4" /></button>
              <div className="text-center">
                <p className="text-lg font-bold">~{area} sq ft</p>
                <p className="text-xs text-muted-foreground">Typical {bhk === "Other" ? "flat" : bhk}</p>
              </div>
              <button aria-label="Increase" onClick={() => setArea((a) => a + 25)} className="rounded-full bg-muted p-2.5"><Plus className="h-4 w-4" /></button>
            </div>
          </div>
          <div>
            <Label>Flat age</Label>
            <div className="flex flex-wrap gap-2">
              {([["<5", "<5 years"], ["5-15", "5–15 years"], ["15+", "15+ years"]] as const).map(([v, l]) => (
                <Chip key={v} active={age === v} onClick={() => setAge(v)}>{l}</Chip>
              ))}
            </div>
          </div>
          <div>
            <Label>Move-in deadline</Label>
            <div className="flex flex-wrap gap-2">
              {([["<4", "<4 weeks"], ["4-8", "4–8 weeks"], ["8-12", "8–12 weeks"]] as const).map(([v, l]) => (
                <Chip key={v} active={moveIn === v} onClick={() => setMoveIn(v)}>{l}</Chip>
              ))}
            </div>
            {weeks < 6 && <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-warn-soft px-3 py-1 text-xs font-medium text-warn"><Clock className="h-3 w-3" /> Tight deadline — we'll prioritise essentials</p>}
          </div>
          <button className="btn-ink" onClick={() => go("rooms")}>Build My Scope <ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
    );
  } else if (step === "rooms") {
    const ok = estWeeks <= weeks;
    body = (
      <div className="pb-28">
        <Header title="Room Map & Priorities" onBack={() => go("snapshot")} />
        <div className="space-y-3 p-4">
          <p className="text-sm text-muted-foreground">Pre-filled with typical {bhk === "Other" ? "" : bhk} scope in Mumbai. Toggle what you need right now vs later.</p>
          <div className={`rounded-xl px-3 py-2 text-xs font-medium ${ok ? "bg-brand-soft text-brand-strong" : "bg-warn-soft text-warn"}`}>
            Target move-in: {weeks} weeks · Essential scope takes ~{estWeeks} weeks {ok ? "✓" : "⚠"}
          </div>
          {rooms.map((r) => {
            const Ic = ROOM_ICONS[r.id] ?? Sofa;
            return (
              <div key={r.id} className={`card-surface p-4 ${r.status === "essential" ? "border-brand" : ""}`}>
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft"><Ic className="h-5 w-5 text-brand-strong" /></div>
                  <div className="min-w-0">
                    <p className="font-bold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.id === "kitchen" ? `${{ cosmetic: "Cosmetic refresh", modular: "L-shape BWP marine ply cabinets, quartz counter", gut: "Full gut & redo" }[kOpt]} · ${tier}` : r.desc}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 rounded-full bg-muted p-1 text-xs font-semibold">
                  {(["essential", "later", "none"] as const).map((s) => (
                    <button key={s} onClick={() => setStatus(r.id, s)} className={`rounded-full py-1.5 ${r.status === s ? (s === "essential" ? "bg-brand text-brand-foreground" : s === "later" ? "bg-info text-brand-foreground" : "bg-ink text-ink-foreground") : "text-muted-foreground"}`}>
                      {s === "essential" ? "Essential" : s === "later" ? "Later" : "Skip"}
                    </button>
                  ))}
                </div>
                <button onClick={() => { setDraft({ tier, opt: kOpt }); setSheet(true); }} className="mt-2 text-xs font-medium text-muted-foreground hover:text-foreground">Customize Details <Pencil className="inline h-3 w-3" /></button>
              </div>
            );
          })}
        </div>
        <div className="fixed bottom-16 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t bg-card p-3">
          <p className="mb-2 text-center text-xs font-medium text-muted-foreground">{essItems} Essential Items · Est. {estWeeks} weeks</p>
          <button className="btn-ink" onClick={() => go("budget")}>Calculate Reality Budget <ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
    );
  } else if (step === "budget") {
    body = (
      <div>
        <Header title="Scope Brief & Budget" onBack={() => go("rooms")} />
        <div className="space-y-4 p-4">
          <div className="rounded-2xl bg-gradient-brand p-[2px]">
            <div className="rounded-[14px] bg-card p-5">
              <p className="text-sm font-medium text-muted-foreground">Realistic Budget for your {bhk === "Other" ? "flat" : bhk}</p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight">{formatLakh(b.low)} – {formatLakh(b.high)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatLakh(b.essLow)}–{formatLakh(b.essHigh)} Essential Work + {formatLakh(b.buffer)} Safety Buffer</p>
              <div className="mt-4 flex h-3 overflow-hidden rounded-full">
                <div className="bg-brand" style={{ width: `${b.share.essential}%` }} />
                <div className="bg-info" style={{ width: `${b.share.deferred}%` }} />
                <div className="bg-warn" style={{ width: `${b.share.buffer}%` }} />
              </div>
              <div className="mt-3 space-y-1 text-xs">
                <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand" />Essential Scope ({b.share.essential}%)</p>
                <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-info" />Deferred / Later ({b.share.deferred}%) · {formatLakh(b.deferred)}</p>
                <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-warn" />Old-Flat Safety Buffer ({b.share.buffer}%)</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 rounded-2xl bg-info-soft p-4 text-xs">
            <Info className="h-4 w-4 shrink-0 text-info" />
            <p><b>Why the Safety Buffer?</b> Your flat is ~{ageYears} years old. {Math.round(b.bufferPct * 100)}% is reserved for concealed plumbing rust or uneven screed, so surprise bills don't trap you.</p>
          </div>
          <div className="card-surface flex items-center gap-3 p-4">
            <FileText className="h-8 w-8 text-brand-strong" />
            <p className="text-sm font-semibold">{essItems + 6} Line Items · {essRooms.length} Rooms · {tier} Spec Sheet Generated</p>
          </div>
          <div className="card-surface p-5">
            <p className="text-xs font-semibold text-brand-strong">STEP 2 OF 2</p>
            <h3 className="font-bold">Get Itemized Quotes</h3>
            <p className="mt-1 text-sm text-muted-foreground">We have matched your brief with 3 verified local teams who guarantee line-by-line pricing on this exact scope.</p>
            <button className="btn-ink mt-4" onClick={() => go("pros")}>View 3 Matched Pros & Request Quotes <ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    );
  } else if (step === "pros") {
    const pros = [
      ["Apex Living Studio", "4.9", "24 projects in Andheri · 12 mins away", ["GST Verified ✓", "Guarantees Itemized BOQ"], "Resale flat structural overhauls & modular interiors"],
      ["Studio Craft Interiors", "4.8", "18 projects in ₹10L–₹15L range", ["ID Verified ✓", "Zero Surprise-Cost Pledge"], "Fast-track 6-week handover specialists"],
      ["MetroBuild Solutions", "4.7", "31 projects completed", ["Reference Checked ✓", "Advance Capped at 20%"], "Civil, concealed plumbing & turnkey execution"],
    ] as const;
    body = (
      <div>
        <Header title="Matched Pros" onBack={() => go("budget")} />
        <div className="space-y-3 p-4">
          <h2 className="text-lg font-bold">3 Verified Pros Matched in Andheri West</h2>
          <p className="flex items-center gap-1 text-xs text-muted-foreground"><Lock className="h-3 w-3" />Your phone number stays private. Pros only receive your Scope Brief.</p>
          {pros.map(([n, r, m, badges, s]) => (
            <div key={n} className="card-surface p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-brand font-bold text-brand-foreground">{n[0]}</div>
                <div>
                  <p className="font-bold">{n}</p>
                  <p className="text-xs text-muted-foreground"><Star className="inline h-3 w-3 fill-warn text-warn" /> {r} ({m})</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {badges.map((x, i) => <span key={x} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${i === 0 ? "bg-brand-soft text-brand-strong" : "bg-muted"}`}>{x}</span>)}
              </div>
              <p className="mt-2 text-xs italic text-muted-foreground">"{s}"</p>
            </div>
          ))}
          <div className="card-surface p-4">
            <Label>WhatsApp verification</Label>
            <div className="flex gap-2">
              <input defaultValue="+91 98201 XXXXX" className="min-w-0 flex-1 rounded-full border px-4 py-2 text-sm" />
              <button onClick={() => setOtp(true)} className={`rounded-full px-4 text-sm font-semibold ${otp ? "bg-brand text-brand-foreground" : "bg-ink text-ink-foreground"}`}>{otp ? "Verified ✓" : "Verify OTP"}</button>
            </div>
          </div>
          <button className="btn-ink" onClick={() => go("inbox")}>Send Brief to These 3 Pros (Instant Dispatch)</button>
        </div>
      </div>
    );
  } else if (step === "inbox") {
    body = (
      <div>
        <Header title="Quote Inbox" onBack={() => go("pros")} />
        <div className="space-y-4 p-4">
          <div className="card-surface space-y-3 p-4">
            {[["Brief Dispatched (Today)", true], ["Quotes Expected within 48 Hours (2 Ready)", true], ["Compare on Same Scope", false]].map(([t, d], i) => (
              <div key={t as string} className="flex items-center gap-3">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${d ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"}`}>{i === 0 ? <Check className="h-4 w-4" /> : i + 1}</div>
                <p className="text-sm font-medium">{t as string}</p>
              </div>
            ))}
          </div>
          {[["Apex Living Studio", "Quote Ready · ₹13.8L", "bg-brand-soft text-brand-strong"], ["Studio Craft Interiors", "Quote Ready · ₹11.9L ⚠ Flags Found", "bg-warn-soft text-warn"], ["MetroBuild Solutions", "Reviewing Brief · Due in 4 hrs", "bg-muted text-muted-foreground"]].map(([n, s, c]) => (
            <div key={n} className="card-surface flex items-center justify-between gap-2 p-4">
              <p className="text-sm font-bold">{n}</p>
              <span className={`rounded-full px-2.5 py-1 text-right text-[11px] font-semibold ${c}`}>{s}</span>
            </div>
          ))}
          {upload === "done" && (
            <div className="card-surface flex items-center justify-between p-4">
              <p className="text-sm font-bold">Offline Quote (Uploaded)</p>
              <span className="rounded-full bg-info-soft px-2.5 py-1 text-[11px] font-semibold text-info">Scanned · ₹12.6L</span>
            </div>
          )}
          <div className="rounded-2xl border-2 border-dashed p-4">
            <p className="font-bold">Bring Your Own Quote</p>
            <p className="mt-1 text-xs text-muted-foreground">Have a quote from an offline contractor or family friend? Upload it to scan for missing items.</p>
            <button disabled={upload !== "idle"} onClick={() => { setUpload("loading"); setTimeout(() => setUpload("done"), 1500); }} className="mt-3 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold">
              {upload === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" />Scanning…</> : upload === "done" ? <><Check className="h-4 w-4" />Added to comparison</> : <><Upload className="h-4 w-4" />Upload Offline Quote (PDF/Photo)</>}
            </button>
          </div>
          <button className="btn-ink" onClick={() => go("compare")}>Compare & Audit Quotes ({upload === "done" ? 3 : 2} Ready) <ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
    );
  } else if (step === "compare") {
    const rows = [
      ["Kitchen Modular Plywood", ["₹2.4L", "Marine BWP Grade ✓", "ok"], ["₹2.1L", "Commercial MR Ply ⚠ Downgrade", "warn"], ["₹2.3L", "BWR Ply", "ok"], true],
      ["Bathroom Waterproofing", ["₹45,000", "2-coat polymer ✓", "ok"], ["MISSING ⚠", "Contractor excluded it!", "warn"], ["₹30,000", "Single coat", "warn"], true],
      ["Living False Ceiling", ["₹65,000", "Saint-Gobain Gypsum ✓", "ok"], ["₹60,000", "Local POP", "muted"], ["₹62,000", "Gypsum", "ok"], true],
      ["Electrical Rewiring", ["₹1.1L", "FRLS wires ✓", "ok"], ["₹1.1L", "FRLS wires ✓", "ok"], ["₹1.0L", "FR wires", "ok"], false],
      ["Upfront Advance Demanded", ["20% Advance ✓", "", "ok"], ["50% Cash Advance ⚠", "High Risk", "warn"], ["30%", "", "muted"], true],
    ] as const;
    const cols = upload === "done" ? 3 : 2;
    const tone = (t: string) => (t === "ok" ? "text-brand-strong" : t === "warn" ? "text-warn" : "text-muted-foreground");
    body = (
      <div>
        <Header title="Normalized Quote Comparison" onBack={() => go("inbox")} />
        <div className="space-y-4 p-4">
          <div className="flex gap-2">
            <Chip active={diffOnly} onClick={() => setDiffOnly(true)}>View Differences Only</Chip>
            <Chip active={!diffOnly} onClick={() => setDiffOnly(false)}>View All 24 Line Items</Chip>
          </div>
          <div className="card-surface overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted text-left">
                <tr><th className="p-2.5">Line Item</th><th className="p-2.5">Apex Living</th><th className="p-2.5">Studio Craft</th>{cols === 3 && <th className="p-2.5">Offline</th>}</tr>
              </thead>
              <tbody>
                {rows.filter((r) => !diffOnly || r[4]).map(([name, a, s, o]) => (
                  <tr key={name} className="border-t align-top">
                    <td className="p-2.5 font-semibold">{name}</td>
                    {[a, s, o].slice(0, cols).map((c, i) => (
                      <td key={i} className={`p-2.5 ${c[2] === "warn" ? "bg-warn-soft" : ""}`}>
                        <p className={`font-bold ${tone(c[2])}`}>{c[0]}</p>
                        {c[1] && <p className="text-[10px] text-muted-foreground">{c[1]}</p>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-surface space-y-3 p-4">
            <Label>Adjusted Fair Total</Label>
            <div className="flex justify-between text-sm"><span>Apex Living</span><span className="font-bold">₹13.80L <span className="text-xs font-normal text-brand-strong">All items included</span></span></div>
            <div className="text-sm">
              <div className="flex justify-between"><span>Studio Craft</span><span><s className="text-muted-foreground">₹11.90L</s> → <b>₹13.40L</b></span></div>
              <p className="text-right text-xs text-warn">+₹1.50L in missing line items</p>
            </div>
          </div>
          <button className="btn-ink" onClick={() => go("contract")}>Select Apex Living & Review Milestones <ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
    );
  } else {
    body = (
      <div>
        <Header title="Confirm Terms" onBack={() => go("compare")} />
        <div className="space-y-4 p-4">
          <h2 className="text-lg font-bold">Confirm Terms with Apex Living Studio</h2>
          <div className="rounded-2xl bg-brand-soft p-4 text-sm font-semibold text-brand-strong"><Lock className="mr-1 inline h-4 w-4" />24 Line Items · Total ₹13,80,000 · Target Start: Oct 25</div>
          <div className="card-surface p-4">
            <Label>Milestone Payment Schedule</Label>
            {[["Mobilization", "20%", "₹2.76L", "Upon site setup and material delivery."], ["Civil & MEP", "30%", "₹4.14L", "After bathroom waterproofing and concealed piping pass inspection."], ["Woodwork", "30%", "₹4.14L", "After carcass assembly and laminate pressing."], ["Handover", "20%", "₹2.76L", "Only after snag list clearance and deep cleaning."]].map(([t, p, a, d], i) => (
              <div key={t} className="flex gap-3 border-l-2 border-brand py-2 pl-3">
                <div>
                  <p className="text-sm font-bold">Tranche {i + 1} ({t}): {p} ({a})</p>
                  <p className="text-xs text-muted-foreground">{d}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="card-surface space-y-2 p-4">
            <Label>Safe Contractor Pledge · Signed</Label>
            {["No cash advances above 20%", "Written change-order for extra work", "Society NOC compliance guarantee", "Branded materials as per spec sheet", "Weekly photo progress updates"].map((x) => (
              <p key={x} className="flex items-center gap-2 text-sm"><ShieldCheck className="h-4 w-4 text-brand" />{x}</p>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">HYNT does not hold your funds. This schedule generates a legally binding work contract between you and Apex Living Studio.</p>
          <button className="btn-ink" onClick={() => setKickoff(true)}>Hire Professional & Generate Contract <ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="relative mx-auto min-h-screen max-w-md border-x bg-background pb-20 shadow-2xl">
        {body}

        {sheet && (
          <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/50" onClick={() => setSheet(false)}>
            <div className="w-full max-w-md rounded-t-3xl bg-card p-5" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">Customize Kitchen Scope</h3>
                <button aria-label="Close" onClick={() => setSheet(false)}><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-2">
                {([["cosmetic", "Cosmetic Refresh", "Paint + Cabinet wrap + Hardware swap", "Budget"], ["modular", "New Modular Kitchen", "L-shape, BWP Marine Plywood, Soft-close", "Popular"], ["gut", "Full Gut & Redo", "Tear down platform, new tiles, conceal CPVC plumbing", "Old flats"]] as const).map(([v, t, d, badge]) => (
                  <button key={v} onClick={() => setDraft((x) => ({ ...x, opt: v }))} className={`card-surface w-full p-3 text-left ${draft.opt === v ? "border-2 border-brand" : ""}`}>
                    <div className="flex items-center justify-between"><p className="font-bold">{t}</p><span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold">{badge}</span></div>
                    <p className="text-xs text-muted-foreground">{d}</p>
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <Label>Finish tier</Label>
                <div className="flex gap-2">{(["Basic", "Standard", "Premium"] as const).map((t) => <Chip key={t} active={draft.tier === t} onClick={() => setDraft((x) => ({ ...x, tier: t }))}>{t}</Chip>)}</div>
              </div>
              <p className="mt-4 rounded-xl bg-brand-soft p-3 text-xs font-medium text-brand-strong">{Math.round(area / 62)} Running Feet counter recommended for {area} sq ft flat</p>
              <button className="btn-ink mt-4" onClick={() => { setTier(draft.tier); setKOpt(draft.opt); setSheet(false); }}>Save Room Scope</button>
            </div>
          </div>
        )}

        {kickoff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-6">
            <div className="w-full max-w-sm rounded-3xl bg-card p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-brand"><Check className="h-8 w-8 text-brand-foreground" /></div>
              <h2 className="mt-4 text-xl font-extrabold">Project Kickoff Confirmed! 🎉</h2>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <p>Work contract & finalized Scope Brief dispatched to your WhatsApp.</p>
                <p>Contractor: Apex Living Studio (Contact: Rahul Sharma, Lead Architect)</p>
                <p>Site Mobilization Date: October 25, 2026</p>
              </div>
              <button className="btn-ink mt-5" onClick={() => { setKickoff(false); setActive(true); go("home"); }}>View Active Project Dashboard</button>
              <button className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border py-3 text-sm font-semibold"><Download className="h-4 w-4" />Download Signed Brief PDF</button>
            </div>
          </div>
        )}

        <nav className="fixed bottom-0 left-1/2 z-30 grid w-full max-w-md -translate-x-1/2 grid-cols-5 border-t bg-card py-2">
          {[[Home, "Home"], [Compass, "Explore"], [Plus, "Ask"], [CalendarDays, "Events"], [User, "Profile"]].map(([I, l]) => {
            const Ic = I as typeof Home;
            const isAsk = l === "Ask";
            const on = l === "Home";
            return (
              <button key={l as string} onClick={() => on && go("home")} className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${on ? "text-brand-strong" : "text-muted-foreground"}`}>
                {isAsk ? <span className="-mt-5 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-ink-foreground shadow-lg"><Ic className="h-5 w-5" /></span> : <Ic className="h-5 w-5" />}
                {l as string}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

