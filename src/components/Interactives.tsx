import { useState, type ReactNode } from "react";
import { TeX } from "./TeX";

function NumberField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: ReactNode;
  value: number;
  onChange: (n: number) => void;
  step?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : ""}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full rounded-md border border-border bg-input/40 px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </label>
  );
}

function Shell({
  children,
  formula,
  substituted,
  result,
}: {
  children: ReactNode;
  formula: string;
  substituted: string;
  result: string;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-lg border border-border bg-card/60 p-5">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Flagship formula
        </div>
        <div className="text-lg">
          <TeX math={formula} block />
        </div>
        <div className="mt-6 mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Try it — plug in numbers
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{children}</div>
      </div>
      <div className="rounded-lg border border-border bg-card/60 p-5">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Substituted
        </div>
        <div className="min-h-16">
          <TeX math={substituted} block />
        </div>
        <div className="mt-6 mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Result
        </div>
        <div className="text-primary">
          <TeX math={result} block />
        </div>
      </div>
    </div>
  );
}

/* 01 · Distance formula */
export function DistanceInteractive() {
  const [x1, sx1] = useState(1);
  const [y1, sy1] = useState(2);
  const [x2, sx2] = useState(7);
  const [y2, sy2] = useState(10);
  const d = Math.hypot(x2 - x1, y2 - y1);
  return (
    <Shell
      formula="d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}"
      substituted={`d = \\sqrt{(${x2} - ${x1})^2 + (${y2} - ${y1})^2}`}
      result={`d = ${Number(d.toFixed(4))}`}
    >
      <NumberField label={<TeX math="x_1" />} value={x1} onChange={sx1} />
      <NumberField label={<TeX math="y_1" />} value={y1} onChange={sy1} />
      <NumberField label={<TeX math="x_2" />} value={x2} onChange={sx2} />
      <NumberField label={<TeX math="y_2" />} value={y2} onChange={sy2} />
    </Shell>
  );
}

/* 02 · Contrapositive builder (deductive reasoning drill) */
export function AngleSumInteractive() {
  const [a, sa] = useState(55);
  const [b, sb] = useState(65);
  const c = 180 - a - b;
  return (
    <Shell
      formula="m\\angle A + m\\angle B + m\\angle C = 180^\\circ"
      substituted={`m\\angle C = 180 - ${a} - ${b}`}
      result={`m\\angle C = ${c}^\\circ`}
    >
      <NumberField label={<TeX math="m\\angle A" />} value={a} onChange={sa} />
      <NumberField label={<TeX math="m\\angle B" />} value={b} onChange={sb} />
    </Shell>
  );
}

/* 03 · Perpendicular slope */
export function PerpSlopeInteractive() {
  const [m, sm] = useState(2);
  const perp = m === 0 ? NaN : -1 / m;
  return (
    <Shell
      formula="m_1 \\cdot m_2 = -1"
      substituted={`m_2 = -\\dfrac{1}{${m}}`}
      result={
        Number.isFinite(perp)
          ? `m_2 = ${Number(perp.toFixed(4))}`
          : "m_2 \\text{ undefined (vertical)}"
      }
    >
      <NumberField label={<TeX math="m_1" />} value={m} onChange={sm} step={0.5} />
    </Shell>
  );
}

/* 04 · SAS congruence check — proportional-length equality */
export function CongruenceInteractive() {
  const [ab, sab] = useState(6);
  const [de, sde] = useState(6);
  const [ac, sac] = useState(8);
  const [df, sdf] = useState(8);
  const [angA, saA] = useState(50);
  const [angD, saD] = useState(50);
  const ok = ab === de && ac === df && angA === angD;
  return (
    <Shell
      formula="\\text{SAS: } AB = DE,\\ \\angle A = \\angle D,\\ AC = DF"
      substituted={`AB=${ab},\\ DE=${de},\\ \\angle A=${angA}^\\circ,\\ \\angle D=${angD}^\\circ,\\ AC=${ac},\\ DF=${df}`}
      result={ok ? "\\triangle ABC \\cong \\triangle DEF" : "\\text{not congruent by SAS}"}
    >
      <NumberField label={<TeX math="AB" />} value={ab} onChange={sab} />
      <NumberField label={<TeX math="DE" />} value={de} onChange={sde} />
      <NumberField label={<TeX math="\\angle A" />} value={angA} onChange={saA} />
      <NumberField label={<TeX math="\\angle D" />} value={angD} onChange={saD} />
      <NumberField label={<TeX math="AC" />} value={ac} onChange={sac} />
      <NumberField label={<TeX math="DF" />} value={df} onChange={sdf} />
    </Shell>
  );
}

/* 05 · Similarity scale factor */
export function ScaleFactorInteractive() {
  const [a, sa] = useState(6);
  const [b, sb] = useState(9);
  const [side, ss] = useState(8);
  const k = a === 0 ? NaN : b / a;
  const mapped = side * k;
  return (
    <Shell
      formula="k = \\dfrac{A'B'}{AB},\\quad E'F' = k \\cdot EF"
      substituted={`k = ${b}/${a} = ${Number(k.toFixed(4))},\\ E'F' = ${side} \\cdot ${Number(k.toFixed(4))}`}
      result={`E'F' = ${Number(mapped.toFixed(4))}`}
    >
      <NumberField label={<TeX math="AB" />} value={a} onChange={sa} />
      <NumberField label={<TeX math="A'B'" />} value={b} onChange={sb} />
      <NumberField label={<TeX math="EF" />} value={side} onChange={ss} />
    </Shell>
  );
}

/* 06 · Pythagorean / trig calculator */
export function RightTriangleInteractive() {
  const [a, sa] = useState(3);
  const [b, sb] = useState(4);
  const c = Math.hypot(a, b);
  const sinT = a / c;
  const cosT = b / c;
  const tanT = a / b;
  const theta = (Math.atan2(a, b) * 180) / Math.PI;
  return (
    <Shell
      formula="a^2 + b^2 = c^2,\\ \\ \\tan\\theta = \\tfrac{a}{b}"
      substituted={`c = \\sqrt{${a}^2 + ${b}^2},\\ \\tan\\theta = ${a}/${b}`}
      result={`c = ${Number(c.toFixed(4))},\\ \\theta \\approx ${Number(theta.toFixed(2))}^\\circ,\\ \\sin\\theta = ${Number(sinT.toFixed(3))},\\ \\cos\\theta = ${Number(cosT.toFixed(3))},\\ \\tan\\theta = ${Number(tanT.toFixed(3))}`}
    >
      <NumberField label={<TeX math="a\\ (\\text{opp})" />} value={a} onChange={sa} />
      <NumberField label={<TeX math="b\\ (\\text{adj})" />} value={b} onChange={sb} />
    </Shell>
  );
}

/* 07 · Polygon angle sum */
export function PolygonAngleInteractive() {
  const [n, sn] = useState(6);
  const safe = Math.max(3, Math.floor(n || 3));
  const total = (safe - 2) * 180;
  const each = total / safe;
  return (
    <Shell
      formula="S = (n - 2)\\cdot 180^\\circ"
      substituted={`S = (${safe} - 2)\\cdot 180`}
      result={`S = ${total}^\\circ,\\ \\text{each (regular)} = ${Number(each.toFixed(3))}^\\circ`}
    >
      <NumberField label={<TeX math="n" />} value={n} onChange={sn} />
    </Shell>
  );
}

/* 08 · Circle equation / point checker */
export function CircleInteractive() {
  const [h, sh] = useState(2);
  const [k, sk] = useState(-3);
  const [r, sr] = useState(5);
  const [x, sx] = useState(5);
  const [y, sy] = useState(1);
  const lhs = (x - h) ** 2 + (y - k) ** 2;
  const rhs = r * r;
  const state =
    lhs < rhs ? "\\text{inside}" : lhs === rhs ? "\\text{on the circle}" : "\\text{outside}";
  return (
    <Shell
      formula="(x - h)^2 + (y - k)^2 = r^2"
      substituted={`(${x} - ${h})^2 + (${y} - ${k})^2 \\;?\\; ${r}^2`}
      result={`${Number(lhs.toFixed(3))} \\;?\\; ${rhs} \\Rightarrow ${state}`}
    >
      <NumberField label={<TeX math="h" />} value={h} onChange={sh} />
      <NumberField label={<TeX math="k" />} value={k} onChange={sk} />
      <NumberField label={<TeX math="r" />} value={r} onChange={sr} />
      <NumberField label={<TeX math="x" />} value={x} onChange={sx} />
      <NumberField label={<TeX math="y" />} value={y} onChange={sy} />
    </Shell>
  );
}

/* 09 · Sector area */
export function SectorInteractive() {
  const [theta, st] = useState(60);
  const [r, sr] = useState(6);
  const area = (theta / 360) * Math.PI * r * r;
  return (
    <Shell
      formula="A_{\\text{sector}} = \\dfrac{\\theta}{360^\\circ}\\,\\pi r^2"
      substituted={`A = \\dfrac{${theta}}{360}\\cdot \\pi (${r})^2`}
      result={`A \\approx ${Number(area.toFixed(4))}`}
    >
      <NumberField label={<TeX math="\\theta\\ (\\deg)" />} value={theta} onChange={st} />
      <NumberField label={<TeX math="r" />} value={r} onChange={sr} />
    </Shell>
  );
}

/* 10 · Sphere volume */
export function SphereInteractive() {
  const [r, sr] = useState(3);
  const v = (4 / 3) * Math.PI * r ** 3;
  const sa = 4 * Math.PI * r * r;
  return (
    <Shell
      formula="V = \\tfrac{4}{3}\\pi r^3,\\ \\ SA = 4\\pi r^2"
      substituted={`V = \\tfrac{4}{3}\\pi (${r})^3,\\ SA = 4\\pi (${r})^2`}
      result={`V \\approx ${Number(v.toFixed(4))},\\ SA \\approx ${Number(sa.toFixed(4))}`}
    >
      <NumberField label={<TeX math="r" />} value={r} onChange={sr} />
    </Shell>
  );
}

export const interactives = [
  {
    title: "Distance Between Two Points",
    blurb:
      "Compute the distance between (x₁, y₁) and (x₂, y₂) with the Pythagorean-based distance formula.",
    Comp: DistanceInteractive,
  },
  {
    title: "Triangle Angle Sum",
    blurb: "Given two angles of a triangle, find the third using the 180° sum.",
    Comp: AngleSumInteractive,
  },
  {
    title: "Perpendicular Slope",
    blurb: "Enter a slope; get the perpendicular (negative reciprocal) slope.",
    Comp: PerpSlopeInteractive,
  },
  {
    title: "SAS Congruence Check",
    blurb: "Test two triangles for congruence by Side–Angle–Side.",
    Comp: CongruenceInteractive,
  },
  {
    title: "Similarity Scale Factor",
    blurb: "Compute the scale factor between similar triangles and map a side length.",
    Comp: ScaleFactorInteractive,
  },
  {
    title: "Right-Triangle Trig",
    blurb: "Enter the legs; get the hypotenuse and every basic trig ratio.",
    Comp: RightTriangleInteractive,
  },
  {
    title: "Polygon Angle Sum",
    blurb: "For an n-gon, compute the total interior angle sum and each regular angle.",
    Comp: PolygonAngleInteractive,
  },
  {
    title: "Point-on-Circle Checker",
    blurb: "Given a circle (h, k, r), classify a point as inside, on, or outside.",
    Comp: CircleInteractive,
  },
  {
    title: "Sector Area",
    blurb: "Compute the area of a circular sector from θ and r.",
    Comp: SectorInteractive,
  },
  {
    title: "Sphere Volume & Surface Area",
    blurb: "Compute V = (4/3)πr³ and SA = 4πr² for a sphere.",
    Comp: SphereInteractive,
  },
];
