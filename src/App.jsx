import { useState, useEffect, useRef } from "react";

// Inject Google Fonts
if (typeof document !== "undefined") {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap";
  document.head.appendChild(link);
}

const C = {
  bg: "#1a1a1a",
  card: "#242424",
  yellow: "#F5C842",
  coral: "#F4635A",
  teal: "#5ECFCF",
  gold: "#8B7D2A",
  text: "#F5F5F0",
  muted: "#888",
  border: "#333",
};

const COMPARISONS = [
  { name: "PS5",                price: 499,  emoji: "🎮" },
  { name: "iPhone 15",          price: 999,  emoji: "📱" },
  { name: "AirPods Pro",        price: 249,  emoji: "🎧" },
  { name: "Netflix (month)",    price: 15,   emoji: "📺" },
  { name: "Spotify (month)",    price: 11,   emoji: "🎵" },
  { name: "Amazon Prime (mo.)", price: 15,   emoji: "📦" },
  { name: "Chipotle burrito",   price: 12,   emoji: "🌯" },
  { name: "Starbucks latte",    price: 7,    emoji: "☕" },
  { name: "Avocado toast",      price: 15,   emoji: "🥑" },
  { name: "McDonald's meal",    price: 10,   emoji: "🍔" },
  { name: "Uber ride",          price: 25,   emoji: "🚗" },
  { name: "Movie ticket",       price: 15,   emoji: "🎬" },
  { name: "Concert ticket",     price: 80,   emoji: "🎤" },
  { name: "Nike Air Force 1s",  price: 110,  emoji: "👟" },
  { name: "Gym membership/mo.", price: 40,   emoji: "💪" },
  { name: "Gas tank fill-up",   price: 60,   emoji: "⛽" },
  { name: "Sephora haul",       price: 75,   emoji: "💄" },
  { name: "IKEA run",           price: 150,  emoji: "🛋️" },
  { name: "Boba tea",           price: 8,    emoji: "🧋" },
  { name: "DoorDash delivery",  price: 20,   emoji: "🛵" },
];

// Thresholds: <4 hrs = chill, 4–12 = think, 12–30 = reconsider, 30+ = run
const VERDICT_POOLS = [
  {
    test: (h) => h < 4,
    color: C.teal,
    emoji: "✅",
    label: "LOWKEY REASONABLE THO",
    subs: [
      "bestie you deserve this, go off 💅",
      "treat yourself, you earned it fr ✨",
      "that's literally nothing, add to cart rn 🛒",
      "your wallet said yes and so do we 🤝",
      "financially responsible era, this is it 🏆",
      "honestly that's cheaper than your therapy copay 💆",
    ],
  },
  {
    test: (h) => h < 12,
    color: C.yellow,
    emoji: "🤔",
    label: "THINK ABOUT IT FR",
    subs: [
      "sleep on it, check ur bank account in the morning",
      "not a crisis but maybe wait for payday bestie",
      "ur brain said want it, ur wallet said maybe 🧠",
      "could also just be a street taco budget tbh 🌮",
      "do a lil pros & cons list, we believe in u",
      "pause. breathe. do u actually need this or just bored",
    ],
  },
  {
    test: (h) => h < 30,
    color: C.coral,
    emoji: "🚨",
    label: "BESTIE RECONSIDER",
    subs: [
      "ur ancestors did not survive for this 💀",
      "that's a whole work week lmaooo",
      "ok but have u tried NOT buying it",
      "the audacity of this price tag is sending me 😭",
      "this is giving 'eating instant noodles for a month' energy",
      "ur future self is shaking rn please reconsider",
    ],
  },
  {
    test: () => true,
    color: C.coral,
    emoji: "💀",
    label: "ABSOLUTELY NOT",
    subs: [
      "sis ur literally selling ur soul rn 😭",
      "this purchase would like to consume ur entire existence",
      "at this point just adopt a rich person as a parent",
      "no cap this is financial villain behavior 🦹",
      "the audacity. the nerve. the sheer unbothered chaos 💅",
      "even amazon's algorithm is concerned about u rn",
    ],
  },
];

function pickVerdict(hours, seed) {
  const tier = VERDICT_POOLS.find((p) => p.test(hours));
  const sub = tier.subs[seed % tier.subs.length];
  return { color: tier.color, emoji: tier.emoji, label: tier.label, sub };
}

function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (target === null) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setValue(target * eased);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

/* ─── Sub-components ──────────────────────────────────────────── */

function TransitStripe({ colors, opacity = 1 }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
      {colors.map((c, i) => (
        <div
          key={i}
          style={{
            width: 44,
            height: 7,
            borderRadius: 4,
            background: c,
            opacity,
          }}
        />
      ))}
    </div>
  );
}

function InputField({ label, placeholder, value, onChange, type, accent }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: 8,
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.68rem",
            letterSpacing: "2.5px",
            color: accent,
            textTransform: "uppercase",
          }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        min={type === "number" ? "0" : undefined}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          background: C.bg,
          border: `2.5px solid ${focused ? accent : "#3a3a3a"}`,
          borderRadius: 14,
          padding: "14px 18px",
          color: C.text,
          fontFamily: "'Syne', sans-serif",
          fontSize: "1rem",
          fontWeight: 600,
          outline: "none",
          boxSizing: "border-box",
          boxShadow: focused ? `0 0 18px ${accent}35` : "none",
          transition: "border 0.2s, box-shadow 0.2s",
        }}
      />
    </div>
  );
}

function ComparisonRow({ emoji, name, count }) {
  const [hov, setHov] = useState(false);
  const nice =
    count >= 1000
      ? Math.round(count).toLocaleString()
      : count >= 10
      ? Math.round(count)
      : count.toFixed(1);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: hov ? "#2e2e2e" : C.bg,
        borderRadius: 12,
        padding: "11px 16px",
        border: `1.5px solid ${hov ? C.teal + "60" : C.border}`,
        transition: "all 0.18s",
        cursor: "default",
      }}
    >
      <span style={{ fontSize: "0.95rem", color: C.text }}>
        {emoji}&nbsp;&nbsp;{name}
      </span>
      <span
        style={{
          color: C.teal,
          fontWeight: 700,
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.9rem",
          textShadow: hov ? `0 0 12px ${C.teal}90` : `0 0 8px ${C.teal}50`,
          transition: "text-shadow 0.18s",
        }}
      >
        ×{nice}
      </span>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────── */

const YEARLY_HOURS = 2080; // 40 hrs/wk × 52 wks

export default function App() {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [wage, setWage] = useState("");
  const [wageMode, setWageMode] = useState("hourly"); // "hourly" | "yearly"
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [calcHours, setCalcHours] = useState(null);
  const resultsRef = useRef(null);

  const displayHours = useCountUp(calcHours);

  // Derived hourly rate for preview hint
  const derivedHourly =
    wageMode === "yearly" && parseFloat(wage) > 0
      ? (parseFloat(wage) / YEARLY_HOURS).toFixed(2)
      : null;

  const handleCalc = () => {
    const p = parseFloat(price);
    const rawWage = parseFloat(wage);
    if (!p || !rawWage || rawWage <= 0 || p <= 0) return;

    const hourlyWage =
      wageMode === "yearly" ? rawWage / YEARLY_HOURS : rawWage;

    const hours = p / hourlyWage;
    const days = hours / 8;
    const weeks = days / 5;

    const comparisons = COMPARISONS.map((c) => ({
      ...c,
      count: p / c.price,
    }))
      .sort((a, b) => Math.abs(a.count - 2) - Math.abs(b.count - 2))
      .slice(0, 6);

    const seed = Math.floor(Math.random() * 997); // random each calc
    setResult({
      hours,
      days,
      weeks,
      comparisons,
      price: p,
      wage: hourlyWage,
      rawWage,
      wageMode,
      seed,
    });
    setCalcHours(hours);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const verdict = result ? pickVerdict(result.hours, result.seed) : null;

  const shareText = result
    ? `Is "${itemName || "this purchase"}" worth it?\n💰 $${result.price} = ${result.hours.toFixed(
        1
      )} hrs of your life\n${verdict.emoji} ${verdict.label}\n\nCalculated with "Is It Worth It?" 🧮`
    : "";

  const handleShare = async () => {
    const sharePayload = {
      title: "Is It Worth It? 🧠💸",
      text: shareText,
      url: "https://priceintime.com",
    };
    // Use native share sheet if available (mobile + modern desktop)
    if (navigator.share) {
      try {
        await navigator.share(sharePayload);
      } catch (err) {
        // user dismissed — do nothing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText}\n\nhttps://priceintime.com`).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleCalc();
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: "'Syne', sans-serif",
        padding: "32px 16px 64px",
      }}
    >
      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <TransitStripe colors={[C.coral, C.yellow, C.teal, C.yellow, C.coral]} />

        <h1
          style={{
            fontSize: "clamp(2.2rem, 9vw, 4.4rem)",
            fontWeight: 800,
            letterSpacing: "-1px",
            lineHeight: 1.05,
            margin: "18px 0 10px",
            textTransform: "uppercase",
          }}
        >
          IS IT{" "}
          <span
            style={{
              color: C.yellow,
              textShadow: `0 0 28px ${C.yellow}80, 0 0 60px ${C.yellow}30`,
            }}
          >
            WORTH IT?
          </span>
        </h1>

        <p
          style={{
            color: C.teal,
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.8rem",
            margin: 0,
            letterSpacing: "1px",
            textShadow: `0 0 12px ${C.teal}60`,
          }}
        >
          // how many hours of your life is this gonna cost?
        </p>

        {/* Tagline pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginTop: 20,
            background: "#242424",
            border: `1.5px solid #3a3a3a`,
            borderRadius: 50,
            padding: "10px 20px",
          }}
        >
          {/* colored dot row */}
          {[C.coral, C.yellow, C.teal].map((c) => (
            <div
              key={c}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: c,
                boxShadow: `0 0 6px ${c}90`,
                flexShrink: 0,
              }}
            />
          ))}
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.72rem",
              color: "#aaa",
              letterSpacing: "0.3px",
              lineHeight: 1.4,
            }}
          >
            for when ur brain &amp; wallet are{" "}
            <span style={{ color: C.yellow, fontWeight: 700 }}>NOT</span>
            {" "}on the same page 🧠💸
          </span>
        </div>
      </div>

      {/* ── Input Card ── */}
      <div
        style={{
          maxWidth: 560,
          margin: "0 auto 36px",
          background: C.card,
          borderRadius: 22,
          border: `2.5px solid ${C.gold}`,
          padding: "28px 28px 24px",
          boxShadow: `0 8px 40px #00000060`,
        }}
      >
        {/* Card header stripe */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <div style={{ flex: 1, height: 4, background: C.yellow, borderRadius: 2 }} />
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.65rem",
              color: C.gold,
              letterSpacing: "3px",
              whiteSpace: "nowrap",
            }}
          >
            ENTER YOUR INFO
          </span>
          <div style={{ flex: 1, height: 4, background: C.yellow, borderRadius: 2 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <InputField
            label="What are you buying?"
            placeholder="PS5, therapy, designer bag..."
            value={itemName}
            onChange={setItemName}
            type="text"
            accent={C.yellow}
          />
          <InputField
            label="Price ($)"
            placeholder="499"
            value={price}
            onChange={setPrice}
            type="number"
            accent={C.coral}
          />

          {/* Wage section with toggle */}
          <div>
            {/* Toggle row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.68rem",
                letterSpacing: "2.5px",
                color: C.teal,
                textTransform: "uppercase",
              }}>
                {wageMode === "hourly" ? "Your hourly wage ($/hr)" : "Your yearly salary ($/yr)"}
              </label>
              <WageToggle mode={wageMode} onChange={setWageMode} />
            </div>

            <InputField
              label=""
              placeholder={wageMode === "hourly" ? "25" : "52000"}
              value={wage}
              onChange={setWage}
              type="number"
              accent={C.teal}
            />

            {/* Derived hourly hint for yearly mode */}
            {wageMode === "yearly" && derivedHourly && (
              <div style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}>
                <div style={{ width: 3, height: 14, background: C.teal, borderRadius: 2, boxShadow: `0 0 6px ${C.teal}80` }} />
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.7rem",
                  color: C.teal,
                  opacity: 0.85,
                  letterSpacing: "0.5px",
                }}>
                  that's ~<strong>${derivedHourly}/hr</strong> (based on 2,080 hrs/yr)
                </span>
              </div>
            )}
          </div>

          <CalcButton onClick={handleCalc} />
        </div>
      </div>

      {/* ── Results ── */}
      {result && (
        <div
          ref={resultsRef}
          style={{
            maxWidth: 560,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            animation: "fadeSlideIn 0.5s ease forwards",
          }}
        >
          <style>{`
            @keyframes fadeSlideIn {
              from { opacity: 0; transform: translateY(24px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes pulse-glow {
              0%, 100% { text-shadow: 0 0 30px #F4635A80, 0 0 60px #F4635A30; }
              50%       { text-shadow: 0 0 50px #F4635Aaa, 0 0 100px #F4635A50; }
            }
            input[type=number]::-webkit-inner-spin-button,
            input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
            ::placeholder { color: #555; }
          `}</style>

          {/* Hours number */}
          <div
            style={{
              background: C.card,
              borderRadius: 22,
              border: `3px solid ${verdict.color}`,
              padding: "36px 24px 28px",
              textAlign: "center",
              boxShadow: `0 0 40px ${verdict.color}25`,
            }}
          >
            <p
              style={{
                margin: "0 0 6px",
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "3px",
                color: C.muted,
                textTransform: "uppercase",
              }}
            >
              hours of your life
            </p>

            <div
              style={{
                fontSize: "clamp(4rem, 18vw, 7rem)",
                fontWeight: 800,
                color: C.coral,
                lineHeight: 1,
                animation: "pulse-glow 2s ease-in-out infinite",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {displayHours.toFixed(1)}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 20,
                marginTop: 14,
                flexWrap: "wrap",
              }}
            >
              {[
                ["DAYS", (result.hours / 8).toFixed(1)],
                ["WEEKS", (result.hours / 40).toFixed(2)],
                ["MINUTES", Math.round(result.hours * 60).toLocaleString()],
              ].map(([unit, val]) => (
                <div key={unit} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.65rem",
                      color: C.muted,
                      letterSpacing: "2px",
                    }}
                  >
                    {unit}
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: C.yellow,
                      textShadow: `0 0 10px ${C.yellow}50`,
                    }}
                  >
                    {val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verdict */}
          <div
            style={{
              background: C.card,
              borderRadius: 22,
              border: `2.5px solid ${verdict.color}`,
              padding: "28px 24px",
              textAlign: "center",
              boxShadow: `0 0 30px ${verdict.color}20`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Corner accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 80,
                height: 4,
                background: verdict.color,
                borderRadius: "0 0 4px 0",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 80,
                height: 4,
                background: verdict.color,
                borderRadius: "0 0 0 4px",
              }}
            />

            <div style={{ fontSize: "2.8rem", lineHeight: 1, marginBottom: 10 }}>
              {verdict.emoji}
            </div>
            <div
              style={{
                fontSize: "clamp(1.3rem, 5vw, 1.9rem)",
                fontWeight: 800,
                color: verdict.color,
                textShadow: `0 0 24px ${verdict.color}70`,
                textTransform: "uppercase",
                letterSpacing: "1px",
                lineHeight: 1.1,
              }}
            >
              {verdict.label}
            </div>
            <p
              style={{
                color: "#aaa",
                margin: "10px 0 0",
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.82rem",
                lineHeight: 1.5,
              }}
            >
              {verdict.sub}
            </p>

            <div
              style={{
                marginTop: 16,
                background: C.bg,
                borderRadius: 10,
                padding: "10px 16px",
                display: "inline-block",
                border: `1px solid ${verdict.color}40`,
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.72rem",
                  color: C.muted,
                  lineHeight: 1.7,
                }}
              >
                {itemName && <><span style={{ color: verdict.color }}>"{itemName}"</span>{" = "}</>}
                ${result.price.toFixed(2)} ÷{" "}
                {result.wageMode === "yearly"
                  ? `$${result.rawWage.toLocaleString()}/yr ($${result.wage.toFixed(2)}/hr)`
                  : `$${result.wage.toFixed(2)}/hr`}
                {" = "}{result.hours.toFixed(2)} hrs
              </span>
            </div>
          </div>

          {/* Comparisons */}
          <div
            style={{
              background: C.card,
              borderRadius: 22,
              border: `2px solid ${C.gold}`,
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 24,
                  background: C.teal,
                  borderRadius: 3,
                  boxShadow: `0 0 10px ${C.teal}80`,
                }}
              />
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.68rem",
                  color: C.gold,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                that's the same as...
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {result.comparisons.map((c) => (
                <ComparisonRow key={c.name} {...c} />
              ))}
            </div>
          </div>

          {/* Share */}
          <button
            onClick={handleShare}
            style={{
              background: copied ? `${C.teal}18` : "transparent",
              color: copied ? C.teal : C.text,
              border: `2px solid ${copied ? C.teal : "#555"}`,
              borderRadius: 50,
              padding: "15px 32px",
              fontSize: "0.9rem",
              fontWeight: 700,
              fontFamily: "'Syne', sans-serif",
              cursor: "pointer",
              letterSpacing: "1px",
              transition: "all 0.22s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: copied ? `0 0 20px ${C.teal}30` : "none",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => {
              if (!copied) {
                e.currentTarget.style.borderColor = C.teal;
                e.currentTarget.style.color = C.teal;
                e.currentTarget.style.boxShadow = `0 0 18px ${C.teal}30`;
              }
            }}
            onMouseLeave={(e) => {
              if (!copied) {
                e.currentTarget.style.borderColor = "#555";
                e.currentTarget.style.color = C.text;
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            {copied ? "✅ link copied!" : "🫂 share the tea"}
          </button>

          {/* Bottom stripe */}
          <div style={{ paddingTop: 12 }}>
            <TransitStripe
              colors={[C.teal, C.gold, C.coral, C.gold, C.teal]}
              opacity={0.45}
            />
          </div>
        </div>
      )}

      {/* Footer when no result yet */}
      {!result && (
        <div style={{ marginTop: 32 }}>
          <TransitStripe
            colors={[C.teal, C.gold, C.coral, C.gold, C.teal]}
            opacity={0.3}
          />
        </div>
      )}
    </div>
  );
}

/* ── Wage Toggle ─────────────────────────────────────────────── */
function WageToggle({ mode, onChange }) {
  return (
    <div
      style={{
        display: "inline-flex",
        background: "#1a1a1a",
        borderRadius: 50,
        padding: 3,
        border: `1.5px solid #3a3a3a`,
        gap: 2,
      }}
    >
      {["hourly", "yearly"].map((m) => {
        const active = mode === m;
        return (
          <button
            key={m}
            onClick={() => onChange(m)}
            style={{
              background: active ? C.teal : "transparent",
              color: active ? "#1a1a1a" : C.muted,
              border: "none",
              borderRadius: 50,
              padding: "4px 12px",
              fontSize: "0.62rem",
              fontWeight: 800,
              fontFamily: "'Space Mono', monospace",
              letterSpacing: "1.5px",
              cursor: "pointer",
              textTransform: "uppercase",
              transition: "all 0.18s",
              boxShadow: active ? `0 0 10px ${C.teal}50` : "none",
            }}
          >
            {m === "hourly" ? "$/hr" : "$/yr"}
          </button>
        );
      })}
    </div>
  );
}

/* ── Calc Button ─────────────────────────────────────────────── */
function CalcButton({ onClick }) {
  const [hov, setHov] = useState(false);
  const [press, setPress] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        background: hov ? C.yellow : C.yellow,
        color: "#1a1a1a",
        border: "none",
        borderRadius: 50,
        padding: "17px 36px",
        fontSize: "1rem",
        fontWeight: 800,
        fontFamily: "'Syne', sans-serif",
        cursor: "pointer",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        transition: "all 0.18s",
        transform: press ? "scale(0.97)" : hov ? "scale(1.02)" : "scale(1)",
        boxShadow: hov
          ? `0 0 30px ${C.yellow}70, 0 4px 20px #00000050`
          : `0 4px 16px #00000040`,
      }}
    >
      CALCULATE 🔍
    </button>
  );
}
