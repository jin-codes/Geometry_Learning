import type { ReactNode } from "react";

/*
 * Inline SVG diagrams, one per topic (keyed by `Topic.diagram`).
 * Main strokes use `currentColor` (the chapter accent); HI / HI2 highlight
 * the part being discussed; MUT is for labels and construction lines.
 */

const HI = "var(--accent-amber)";
const HI2 = "var(--accent-magenta)";
const HI3 = "var(--accent-green)";
const MUT = "var(--muted-foreground)";
const FG = "var(--foreground)";

type P = [number, number];
const rad = (d: number) => (d * Math.PI) / 180;
// Math-convention angle (y up) of the direction p -> q on a y-down canvas.
const ang = (p: P, q: P) => (Math.atan2(-(q[1] - p[1]), q[0] - p[0]) * 180) / Math.PI;

function Svg({ label, h = 190, children }: { label: string; h?: number; children: ReactNode }) {
  return (
    <svg viewBox={`0 0 320 ${h}`} className="h-auto w-full" role="img" aria-label={label}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </g>
    </svg>
  );
}

function T({
  x,
  y,
  children,
  c = MUT,
  anchor = "middle",
  size = 12,
}: {
  x: number;
  y: number;
  children: ReactNode;
  c?: string;
  anchor?: "start" | "middle" | "end";
  size?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={c}
      stroke="none"
      fontSize={size}
      textAnchor={anchor}
      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
    >
      {children}
    </text>
  );
}

const Dot = ({ p, c = FG }: { p: P; c?: string }) => (
  <circle cx={p[0]} cy={p[1]} r={3.5} fill={c} stroke="none" />
);

const Line = ({ a, b, c, dash, w }: { a: P; b: P; c?: string; dash?: boolean; w?: number }) => (
  <line
    x1={a[0]}
    y1={a[1]}
    x2={b[0]}
    y2={b[1]}
    stroke={c}
    strokeWidth={w}
    strokeDasharray={dash ? "5 4" : undefined}
  />
);

const Poly = ({ pts, fill = 0.1, c }: { pts: P[]; fill?: number; c?: string }) => (
  <polygon
    points={pts.map((p) => p.join(",")).join(" ")}
    fill={c ?? "currentColor"}
    fillOpacity={fill}
    stroke={c}
  />
);

/** Arc of radius r about c from math-angle a1 to a2 (counter-clockwise if a2 > a1). */
function Arc({
  c,
  r,
  a1,
  a2,
  color = HI,
  w = 1.8,
}: {
  c: P;
  r: number;
  a1: number;
  a2: number;
  color?: string;
  w?: number;
}) {
  const pt = (a: number) => [c[0] + r * Math.cos(rad(a)), c[1] - r * Math.sin(rad(a))];
  const [x1, y1] = pt(a1);
  const [x2, y2] = pt(a2);
  return (
    <path
      d={`M${x1},${y1} A${r},${r} 0 ${Math.abs(a2 - a1) > 180 ? 1 : 0} ${a2 > a1 ? 0 : 1} ${x2},${y2}`}
      stroke={color}
      strokeWidth={w}
    />
  );
}

/** Angle mark at vertex v between rays to p and q (n concentric arcs, optional label). */
function AngArc({
  v,
  p,
  q,
  r = 18,
  color = HI,
  n = 1,
  label,
}: {
  v: P;
  p: P;
  q: P;
  r?: number;
  color?: string;
  n?: number;
  label?: string;
}) {
  const a1 = ang(v, p);
  const d = ((ang(v, q) - a1 + 540) % 360) - 180;
  const mid = a1 + d / 2;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <Arc key={i} c={v} r={r + i * 4} a1={a1} a2={a1 + d} color={color} />
      ))}
      {label && (
        <T
          x={v[0] + (r + 13) * Math.cos(rad(mid))}
          y={v[1] - (r + 13) * Math.sin(rad(mid)) + 4}
          c={color}
        >
          {label}
        </T>
      )}
    </g>
  );
}

function Ticks({ a, b, n = 1, c = HI }: { a: P; b: P; n?: number; c?: string }) {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const ux = (b[0] - a[0]) / len;
  const uy = (b[1] - a[1]) / len;
  return (
    <g stroke={c} strokeWidth={1.6}>
      {Array.from({ length: n }, (_, i) => {
        const o = (i - (n - 1) / 2) * 4.5;
        const cx = mx + ux * o;
        const cy = my + uy * o;
        return <line key={i} x1={cx + uy * 5} y1={cy - ux * 5} x2={cx - uy * 5} y2={cy + ux * 5} />;
      })}
    </g>
  );
}

/** Right-angle square at p, opening along unit vectors u and v. */
function Right({ p, u, v, a = 9 }: { p: P; u: P; v: P; a?: number }) {
  const p1 = [p[0] + a * u[0], p[1] + a * u[1]];
  const p3 = [p[0] + a * v[0], p[1] + a * v[1]];
  const p2 = [p1[0] + a * v[0], p1[1] + a * v[1]];
  return <path d={`M${p1} L${p2} L${p3}`} stroke={MUT} strokeWidth={1.3} />;
}

/** Right-angle mark at vertex v of the corner between rays to p and q. */
function RightAt({ v, p, q, a = 9 }: { v: P; p: P; q: P; a?: number }) {
  const n = (t: P): P => {
    const l = Math.hypot(t[0] - v[0], t[1] - v[1]);
    return [(t[0] - v[0]) / l, (t[1] - v[1]) / l];
  };
  return <Right p={v} u={n(p)} v={n(q)} a={a} />;
}

/** Chevron marking a line as parallel / directed, at p pointing along `deg` (screen degrees). */
const Chev = ({ p, deg }: { p: P; deg: number }) => (
  <path
    d="M-5,-4.5 L1,0 L-5,4.5"
    transform={`translate(${p[0]},${p[1]}) rotate(${deg})`}
    stroke={HI}
    strokeWidth={1.6}
  />
);

const mid = (a: P, b: P): P => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

/* ───────────── 01 Foundations ───────────── */

function PointsLinesPlanes() {
  return (
    <Svg label="A line through points A and B, and a plane containing point C">
      <Poly
        pts={[
          [170, 160],
          [295, 160],
          [312, 85],
          [187, 85],
        ]}
        fill={0.12}
      />
      <Line a={[10, 60]} b={[150, 110]} />
      <Chev p={[150, 110]} deg={ang([10, 60], [150, 110]) * -1} />
      <Chev p={[10, 60]} deg={180 - ang([10, 60], [150, 110])} />
      <Dot p={[45, 72.5]} c={HI} />
      <Dot p={[110, 95.7]} c={HI} />
      <Dot p={[245, 125]} c={HI2} />
      <T x={45} y={60} c={FG}>
        A
      </T>
      <T x={112} y={83} c={FG}>
        B
      </T>
      <T x={245} y={145} c={FG}>
        C
      </T>
      <T x={78} y={125}>
        line AB
      </T>
      <T x={240} y={178} c={MUT}>
        plane
      </T>
    </Svg>
  );
}

function DistanceMidpoint() {
  const A: P = [60, 140];
  const B: P = [250, 40];
  const M = mid(A, B);
  return (
    <Svg label="Distance and midpoint between two points on the coordinate plane">
      <Line a={[20, 170]} b={[305, 170]} c={MUT} w={1.2} />
      <Line a={[20, 10]} b={[20, 170]} c={MUT} w={1.2} />
      <Line a={A} b={[250, 140]} dash c={MUT} w={1.4} />
      <Line a={[250, 140]} b={B} dash c={MUT} w={1.4} />
      <Right p={[250, 140]} u={[-1, 0]} v={[0, -1]} />
      <Line a={A} b={B} />
      <Dot p={A} />
      <Dot p={B} />
      <Dot p={M} c={HI} />
      <T x={50} y={158} c={FG}>
        A
      </T>
      <T x={262} y={36} c={FG}>
        B
      </T>
      <T x={M[0] + 16} y={M[1] + 16} c={HI}>
        M
      </T>
      <T x={122} y={86}>
        d
      </T>
      <T x={155} y={158}>
        Δx
      </T>
      <T x={266} y={95}>
        Δy
      </T>
    </Svg>
  );
}

function AngleBasics() {
  const arm = 40;
  const at = (v: P, deg: number): P => [
    v[0] + arm * Math.cos(rad(deg)),
    v[1] - arm * Math.sin(rad(deg)),
  ];
  const items: { v: P; deg: number; name: string }[] = [
    { v: [10, 115], deg: 40, name: "acute" },
    { v: [75, 115], deg: 90, name: "right" },
    { v: [165, 115], deg: 130, name: "obtuse" },
  ];
  return (
    <Svg label="Acute, right, obtuse and straight angles">
      {items.map(({ v, deg, name }) => (
        <g key={name}>
          <Line a={v} b={[v[0] + arm, v[1]]} />
          <Line a={v} b={at(v, deg)} />
          {name === "right" ? (
            <Right p={v} u={[1, 0]} v={[0, -1]} a={11} />
          ) : (
            <Arc c={v} r={15} a1={0} a2={deg} />
          )}
          <T x={v[0] + 20} y={150}>
            {name}
          </T>
        </g>
      ))}
      <Line a={[235, 115]} b={[305, 115]} />
      <Arc c={[270, 115]} r={15} a1={0} a2={180} />
      <T x={270} y={150}>
        straight
      </T>
      <T x={30} y={172} c={HI}>
        {"<90°"}
      </T>
      <T x={95} y={172} c={HI}>
        {"=90°"}
      </T>
      <T x={185} y={172} c={HI}>
        {"90°–180°"}
      </T>
      <T x={270} y={172} c={HI}>
        {"=180°"}
      </T>
    </Svg>
  );
}

/* ───────────── 02 Reasoning ───────────── */

function ConditionalVenn() {
  return (
    <Svg label="Venn diagram: everything in p is also in q">
      <ellipse cx={160} cy={95} rx={130} ry={72} fill="currentColor" fillOpacity={0.08} />
      <circle cx={130} cy={95} r={40} fill={HI} fillOpacity={0.2} stroke={HI} />
      <T x={130} y={100} c={HI} size={16}>
        p
      </T>
      <T x={250} y={100} c="currentColor" size={16}>
        q
      </T>
      <T x={160} y={182}>
        if p, then q ( p ⊂ q )
      </T>
    </Svg>
  );
}

/* ───────────── 03 Parallel & perpendicular ───────────── */

function Transversal() {
  const top = 60;
  const bot = 120;
  const P: P = [162.5, top];
  const Q: P = [117.5, bot];
  return (
    <Svg label="Two parallel lines cut by a transversal, with angles 1 to 8">
      <Line a={[20, top]} b={[300, top]} />
      <Line a={[20, bot]} b={[300, bot]} />
      <Line a={[80, 170]} b={[200, 10]} c={HI2} />
      <Chev p={[280, top]} deg={0} />
      <Chev p={[280, bot]} deg={0} />
      <T x={P[0] - 15} y={P[1] - 8} c={HI3}>
        1
      </T>
      <T x={P[0] + 26} y={P[1] - 8}>
        2
      </T>
      <T x={P[0] - 26} y={P[1] + 18} c={HI}>
        3
      </T>
      <T x={P[0] + 15} y={P[1] + 18}>
        4
      </T>
      <T x={Q[0] - 15} y={Q[1] - 8} c={HI3}>
        5
      </T>
      <T x={Q[0] + 26} y={Q[1] - 8} c={HI}>
        6
      </T>
      <T x={Q[0] - 28} y={Q[1] + 18}>
        7
      </T>
      <T x={Q[0] + 15} y={Q[1] + 18}>
        8
      </T>
      <T x={30} y={52}>
        ℓ
      </T>
      <T x={30} y={112}>
        m
      </T>
      <T x={200} y={22} c={HI2}>
        t
      </T>
    </Svg>
  );
}

function SlopesPP() {
  const O: P = [126, 102];
  return (
    <Svg label="Parallel lines share a slope; a perpendicular line has the negative reciprocal slope">
      <Line a={[30, 150]} b={[200, 65]} />
      <Line a={[90, 175]} b={[260, 90]} />
      <Line a={[105, 60]} b={[151, 152]} c={HI2} />
      <RightAt v={O} p={[200, 65]} q={[151, 152]} />
      <T x={208} y={66} anchor="start">
        {"m = ½"}
      </T>
      <T x={268} y={94} anchor="start">
        {"m = ½"}
      </T>
      <T x={158} y={165} c={HI2}>
        {"m = −2"}
      </T>
      <T x={60} y={30}>
        {"m₁ · m₂ = −1"}
      </T>
    </Svg>
  );
}

function Constructions() {
  const P: P = [160, 40];
  const F: P = [160, 140];
  return (
    <Svg label="Constructing a perpendicular and a parallel through a point P">
      <Line a={[20, 140]} b={[300, 140]} />
      <Line a={[20, 40]} b={[300, 40]} c={HI3} />
      <Chev p={[280, 40]} deg={0} />
      <Chev p={[280, 140]} deg={0} />
      <Line a={P} b={F} c={HI2} dash />
      <Line a={P} b={[103, 140]} c={MUT} dash w={1.2} />
      <Line a={P} b={[217, 140]} c={MUT} dash w={1.2} />
      <Ticks a={P} b={[103, 140]} />
      <Ticks a={P} b={[217, 140]} />
      <Right p={F} u={[-1, 0]} v={[0, -1]} />
      <Dot p={P} c={HI} />
      <Dot p={[103, 140]} c={HI} />
      <Dot p={[217, 140]} c={HI} />
      <T x={172} y={36} c={FG}>
        P
      </T>
      <T x={30} y={132}>
        ℓ
      </T>
      <T x={30} y={32} c={HI3}>
        {"∥ ℓ"}
      </T>
      <T x={168} y={125} c={HI2} anchor="start">
        {"⟂ ℓ"}
      </T>
    </Svg>
  );
}

/* ───────────── 04 Triangles ───────────── */

function TriangleSumExterior() {
  const A: P = [50, 150];
  const B: P = [230, 150];
  const C: P = [150, 40];
  const E: P = [295, 150];
  return (
    <Svg label="Triangle with its exterior angle equal to the sum of the two remote interior angles">
      <Poly pts={[A, B, C]} />
      <Line a={B} b={E} />
      <AngArc v={A} p={B} q={C} r={24} label="α" />
      <AngArc v={C} p={A} q={B} r={20} color={HI3} label="γ" />
      <AngArc v={B} p={A} q={C} r={14} color={MUT} />
      <AngArc v={B} p={E} q={C} r={26} color={HI2} label="α+γ" />
      <T x={A[0] - 8} y={166} c={FG}>
        A
      </T>
      <T x={B[0] - 12} y={166} c={FG}>
        B
      </T>
      <T x={C[0]} y={C[1] - 8} c={FG}>
        C
      </T>
    </Svg>
  );
}

const TRI1: [P, P, P] = [
  [20, 140],
  [125, 140],
  [55, 50],
];
const TRI2: [P, P, P] = [
  [190, 140],
  [295, 140],
  [225, 50],
];
function TwoTriangles({ arcs, names }: { arcs: boolean; names: boolean }) {
  const [a, b, c] = TRI1;
  const [d, e, f] = TRI2;
  return (
    <>
      <Poly pts={[a, b, c]} />
      <Poly pts={[d, e, f]} />
      <Ticks a={a} b={b} n={1} />
      <Ticks a={d} b={e} n={1} />
      <Ticks a={a} b={c} n={2} />
      <Ticks a={d} b={f} n={2} />
      <Ticks a={b} b={c} n={3} />
      <Ticks a={e} b={f} n={3} />
      {arcs && (
        <>
          <AngArc v={a} p={b} q={c} n={1} r={16} color={HI3} />
          <AngArc v={d} p={e} q={f} n={1} r={16} color={HI3} />
          <AngArc v={b} p={a} q={c} n={2} r={14} color={HI2} />
          <AngArc v={e} p={d} q={f} n={2} r={14} color={HI2} />
          <AngArc v={c} p={a} q={b} n={3} r={12} color={HI} />
          <AngArc v={f} p={d} q={e} n={3} r={12} color={HI} />
        </>
      )}
      {names && (
        <>
          <T x={a[0] - 8} y={156} c={FG}>
            A
          </T>
          <T x={b[0] + 8} y={156} c={FG}>
            B
          </T>
          <T x={c[0]} y={c[1] - 8} c={FG}>
            C
          </T>
          <T x={d[0] - 8} y={156} c={FG}>
            D
          </T>
          <T x={e[0] + 8} y={156} c={FG}>
            E
          </T>
          <T x={f[0]} y={f[1] - 8} c={FG}>
            F
          </T>
        </>
      )}
      <T x={158} y={100} size={20}>
        ≅
      </T>
    </>
  );
}

function CongruencePostulates() {
  return (
    <Svg label="Two congruent triangles with matching tick marks (SSS)">
      <TwoTriangles arcs={false} names={false} />
      <T x={160} y={180}>
        SSS · SAS · ASA · AAS · HL
      </T>
    </Svg>
  );
}

function Cpctc() {
  return (
    <Svg label="Congruent triangles: corresponding parts are congruent">
      <TwoTriangles arcs names />
      <T x={160} y={182}>
        △ABC ≅ △DEF ⇒ ∠A ≅ ∠D, AB ≅ DE …
      </T>
    </Svg>
  );
}

function IsoscelesTriangle() {
  const A: P = [160, 25];
  const B: P = [50, 150];
  const C: P = [270, 150];
  const M: P = [160, 150];
  return (
    <Svg label="Isosceles triangle with equal legs, equal base angles and a perpendicular bisector">
      <Poly pts={[A, B, C]} />
      <Ticks a={A} b={B} n={1} />
      <Ticks a={A} b={C} n={1} />
      <Line a={A} b={M} c={HI2} dash />
      <Right p={M} u={[-1, 0]} v={[0, -1]} />
      <Ticks a={B} b={M} n={2} c={HI2} />
      <Ticks a={M} b={C} n={2} c={HI2} />
      <AngArc v={B} p={C} q={A} r={24} color={HI3} />
      <AngArc v={C} p={B} q={A} r={24} color={HI3} />
      <T x={A[0]} y={A[1] - 8} c={FG}>
        A
      </T>
      <T x={B[0] - 8} y={166} c={FG}>
        B
      </T>
      <T x={C[0] + 8} y={166} c={FG}>
        C
      </T>
      <T x={M[0]} y={168} c={FG}>
        M
      </T>
    </Svg>
  );
}

/* ───────────── 05 Similarity ───────────── */

function SimilarTriangles({ sides }: { sides: boolean }) {
  const s1: [P, P, P] = [
    [20, 150],
    [100, 150],
    [70, 105],
  ];
  const k = 1.8;
  const o: P = [140, 150];
  const s2: [P, P, P] = s1.map((p) => [o[0] + (p[0] - 20) * k, o[1] - (150 - p[1]) * k] as P) as [
    P,
    P,
    P,
  ];
  return (
    <Svg label="Two similar triangles with equal angles and proportional sides">
      <Poly pts={s1} />
      <Poly pts={s2} />
      <AngArc v={s1[0]} p={s1[1]} q={s1[2]} r={14} color={HI3} />
      <AngArc v={s2[0]} p={s2[1]} q={s2[2]} r={20} color={HI3} />
      <AngArc v={s1[1]} p={s1[0]} q={s1[2]} r={14} color={HI2} n={2} />
      <AngArc v={s2[1]} p={s2[0]} q={s2[2]} r={20} color={HI2} n={2} />
      {sides && (
        <>
          <T x={60} y={168}>
            a
          </T>
          <T x={s2[0][0] + 72} y={168}>
            ka
          </T>
          <T x={35} y={122}>
            b
          </T>
          <T x={s2[0][0] + 22} y={106}>
            kb
          </T>
        </>
      )}
      <T x={160} y={184} c={HI}>
        {sides ? "scale factor k" : "AA ⇒ similar"}
      </T>
    </Svg>
  );
}

function SideSplitter() {
  const A: P = [150, 20];
  const B: P = [30, 160];
  const C: P = [270, 160];
  const D: P = [85.7, 95];
  const E: P = [214.3, 95];
  return (
    <Svg label="A line parallel to one side divides the other two sides proportionally">
      <Poly pts={[A, B, C]} />
      <Line a={D} b={E} c={HI2} />
      <Chev p={[190, 95]} deg={0} />
      <Chev p={[210, 160]} deg={0} />
      <T x={A[0]} y={A[1] - 6} c={FG}>
        A
      </T>
      <T x={B[0] - 8} y={172} c={FG}>
        B
      </T>
      <T x={C[0] + 8} y={172} c={FG}>
        C
      </T>
      <T x={D[0] - 10} y={D[1] + 2} c={FG}>
        D
      </T>
      <T x={E[0] + 10} y={E[1] + 2} c={FG}>
        E
      </T>
      <T x={104} y={62}>
        x
      </T>
      <T x={54} y={132}>
        y
      </T>
      <T x={196} y={62}>
        u
      </T>
      <T x={246} y={132}>
        v
      </T>
      <T x={160} y={184} c={HI}>
        x / y = u / v
      </T>
    </Svg>
  );
}

function ScaleRatios() {
  return (
    <Svg label="A square scaled by 2: perimeter doubles, area quadruples">
      <rect x={30} y={90} width={40} height={40} fill="currentColor" fillOpacity={0.15} />
      <rect x={110} y={50} width={80} height={80} fill="currentColor" fillOpacity={0.15} />
      <T x={50} y={148}>
        a
      </T>
      <T x={150} y={148}>
        ka
      </T>
      <T x={250} y={80} c={HI}>
        perimeter · k
      </T>
      <T x={250} y={102} c={HI2}>
        {"area · k²"}
      </T>
      <T x={250} y={124} c={HI3}>
        {"volume · k³"}
      </T>
    </Svg>
  );
}

/* ───────────── 06 Right triangles ───────────── */

function Pythagorean() {
  const C: P = [130, 150];
  const B: P = [190, 150];
  const A: P = [130, 70];
  return (
    <Svg label="Squares on the three sides of a right triangle" h={220}>
      <Poly pts={[C, B, [190, 210], [130, 210]]} fill={0.12} c={HI} />
      <Poly pts={[A, C, [50, 150], [50, 70]]} fill={0.12} c={HI3} />
      <Poly pts={[A, B, [270, 90], [210, 10]]} fill={0.12} c={HI2} />
      <Poly pts={[A, B, C]} fill={0.2} />
      <Right p={C} u={[1, 0]} v={[0, -1]} />
      <T x={160} y={187} c={HI}>
        {"a²"}
      </T>
      <T x={90} y={115} c={HI3}>
        {"b²"}
      </T>
      <T x={210} y={60} c={HI2}>
        {"c²"}
      </T>
      <T x={160} y={144}>
        a
      </T>
      <T x={121} y={112}>
        b
      </T>
      <T x={170} y={102}>
        c
      </T>
    </Svg>
  );
}

function SpecialRight() {
  return (
    <Svg label="45-45-90 and 30-60-90 special right triangles">
      <Poly
        pts={[
          [25, 150],
          [115, 150],
          [25, 60],
        ]}
      />
      <Right p={[25, 150]} u={[1, 0]} v={[0, -1]} />
      <T x={70} y={168}>
        x
      </T>
      <T x={12} y={108}>
        x
      </T>
      <T x={78} y={98}>
        {"x√2"}
      </T>
      <T x={92} y={143} c={HI}>
        45°
      </T>
      <T x={38} y={82} c={HI}>
        45°
      </T>
      <Poly
        pts={[
          [190, 150],
          [285, 150],
          [190, 95],
        ]}
      />
      <Right p={[190, 150]} u={[1, 0]} v={[0, -1]} />
      <T x={238} y={168}>
        {"x√3"}
      </T>
      <T x={172} y={125}>
        x
      </T>
      <T x={252} y={112}>
        2x
      </T>
      <T x={258} y={143} c={HI}>
        30°
      </T>
      <T x={204} y={112} c={HI2}>
        60°
      </T>
    </Svg>
  );
}

function TrigRatios() {
  const A: P = [40, 150];
  const B: P = [240, 150];
  const C: P = [240, 50];
  return (
    <Svg label="Right triangle with opposite, adjacent and hypotenuse relative to angle theta">
      <Poly pts={[A, B, C]} />
      <Right p={B} u={[-1, 0]} v={[0, -1]} />
      <AngArc v={A} p={B} q={C} r={30} label="θ" />
      <T x={140} y={168} c={HI3}>
        adjacent
      </T>
      <T x={280} y={105} c={HI2}>
        opposite
      </T>
      <T x={125} y={88} c={HI}>
        hypotenuse
      </T>
      <T x={160} y={20}>
        sin θ = opp / hyp
      </T>
    </Svg>
  );
}

function ElevationDepression() {
  const car: P = [50, 160];
  const top: P = [250, 40];
  return (
    <Svg label="Angle of elevation from the ground equals the angle of depression from the top">
      <Line a={[10, 160]} b={[310, 160]} c={MUT} w={1.2} />
      <Line a={[250, 160]} b={top} w={3} />
      <Line a={car} b={top} c={HI2} />
      <Line a={car} b={[240, 160]} dash c={MUT} w={1.3} />
      <Line a={[70, 40]} b={top} dash c={MUT} w={1.3} />
      <AngArc v={car} p={[240, 160]} q={top} r={38} label="" />
      <AngArc v={top} p={[70, 40]} q={car} r={38} color={HI3} />
      <Dot p={car} />
      <Dot p={top} />
      <T x={100} y={147} c={HI}>
        elevation
      </T>
      <T x={150} y={35} c={HI3}>
        depression
      </T>
      <T x={car[0]} y={178}>
        observer
      </T>
    </Svg>
  );
}

/* ───────────── 07 Quadrilaterals ───────────── */

function PolygonAngles() {
  const c: P = [160, 92];
  const v: P[] = Array.from({ length: 6 }, (_, i): P => [
    c[0] + 75 * Math.cos(rad(i * 60 + 30)),
    c[1] - 75 * Math.sin(rad(i * 60 + 30)),
  ]);
  return (
    <Svg label="A hexagon split into four triangles from one vertex">
      <Poly pts={v} />
      {[2, 3, 4].map((i) => (
        <Line key={i} a={v[0]} b={v[i]} c={HI} dash />
      ))}
      <T x={160} y={184} c={HI}>
        {"(n − 2) · 180° = 4 · 180°"}
      </T>
    </Svg>
  );
}

function ParallelogramDiagram() {
  const A: P = [60, 150];
  const B: P = [220, 150];
  const C: P = [270, 60];
  const D: P = [110, 60];
  const O = mid(A, C);
  return (
    <Svg label="Parallelogram with parallel opposite sides and diagonals that bisect each other">
      <Poly pts={[A, B, C, D]} />
      <Line a={A} b={C} c={HI} dash />
      <Line a={B} b={D} c={HI} dash />
      <Dot p={O} c={HI2} />
      <Chev p={[150, 150]} deg={0} />
      <Chev p={[230, 60]} deg={0} />
      <Ticks a={A} b={D} n={1} />
      <Ticks a={B} b={C} n={1} />
      <Ticks a={A} b={B} n={2} />
      <Ticks a={D} b={C} n={2} />
      <T x={50} y={166} c={FG}>
        A
      </T>
      <T x={230} y={166} c={FG}>
        B
      </T>
      <T x={280} y={60} c={FG}>
        C
      </T>
      <T x={100} y={54} c={FG}>
        D
      </T>
    </Svg>
  );
}

function SpecialParallelograms() {
  const rect: P[] = [
    [10, 65],
    [95, 65],
    [95, 125],
    [10, 125],
  ];
  const rh: P[] = [
    [160, 55],
    [215, 95],
    [160, 135],
    [105, 95],
  ];
  const sq: P[] = [
    [235, 60],
    [305, 60],
    [305, 130],
    [235, 130],
  ];
  return (
    <Svg label="Rectangle with equal diagonals, rhombus with perpendicular diagonals, and a square with both">
      <Poly pts={rect} />
      <Line a={rect[0]} b={rect[2]} c={HI} />
      <Line a={rect[1]} b={rect[3]} c={HI} />
      <Poly pts={rh} />
      <Line a={rh[0]} b={rh[2]} c={HI2} />
      <Line a={rh[1]} b={rh[3]} c={HI2} />
      <Right p={[160, 95]} u={[1, 0]} v={[0, -1]} a={8} />
      <Poly pts={sq} />
      <Line a={sq[0]} b={sq[2]} c={HI} />
      <Line a={sq[1]} b={sq[3]} c={HI2} />
      <Right p={[270, 95]} u={[1, 0]} v={[0, -1]} a={8} />
      <T x={52} y={155}>
        rectangle
      </T>
      <T x={160} y={155}>
        rhombus
      </T>
      <T x={270} y={155}>
        square
      </T>
      <T x={52} y={175} c={HI}>
        = diagonals
      </T>
      <T x={160} y={175} c={HI2}>
        ⟂ diagonals
      </T>
      <T x={270} y={175} c={HI3}>
        both
      </T>
    </Svg>
  );
}

function TrapezoidKite() {
  const kite: P[] = [
    [230, 30],
    [280, 90],
    [230, 160],
    [180, 90],
  ];
  return (
    <Svg label="Trapezoid with its midsegment and a kite with perpendicular diagonals">
      <Poly
        pts={[
          [20, 140],
          [140, 140],
          [110, 60],
          [50, 60],
        ]}
      />
      <Line a={[35, 100]} b={[125, 100]} c={HI} dash />
      <Chev p={[95, 60]} deg={0} />
      <Chev p={[100, 140]} deg={0} />
      <T x={80} y={52}>
        b₁
      </T>
      <T x={80} y={158}>
        b₂
      </T>
      <T x={80} y={94} c={HI}>
        midsegment
      </T>
      <Poly pts={kite} />
      <Line a={kite[0]} b={kite[2]} c={HI2} />
      <Line a={kite[1]} b={kite[3]} c={HI2} />
      <Right p={[230, 90]} u={[1, 0]} v={[0, -1]} a={8} />
      <Ticks a={kite[0]} b={kite[1]} n={1} />
      <Ticks a={kite[0]} b={kite[3]} n={1} />
      <Ticks a={kite[1]} b={kite[2]} n={2} />
      <Ticks a={kite[3]} b={kite[2]} n={2} />
    </Svg>
  );
}

/* ───────────── 08 Circles ───────────── */

function ArcLength() {
  const O: P = [160, 100];
  const r = 70;
  return (
    <Svg label="Circle with radius, central angle and arc">
      <circle cx={O[0]} cy={O[1]} r={r} fill="currentColor" fillOpacity={0.06} />
      <Line a={O} b={[O[0] + r, O[1]]} />
      <Line a={O} b={[O[0] + r * Math.cos(rad(60)), O[1] - r * Math.sin(rad(60))]} />
      <Arc c={O} r={r} a1={0} a2={60} color={HI} w={4} />
      <Arc c={O} r={22} a1={0} a2={60} color={HI2} />
      <Dot p={O} />
      <T x={O[0] + 42} y={O[1] + 16}>
        r
      </T>
      <T x={O[0] + 38} y={O[1] - 8} c={HI2}>
        θ
      </T>
      <T x={O[0] + 68} y={O[1] - 55} c={HI}>
        s
      </T>
      <T x={100} y={182} c={HI}>
        {"s = r θ"}
      </T>
    </Svg>
  );
}

function CentralInscribed() {
  const O: P = [160, 100];
  const A: P = [95, 137.5];
  const B: P = [225, 137.5];
  const C: P = [160, 25];
  return (
    <Svg label="A central angle is twice the inscribed angle on the same arc">
      <circle cx={O[0]} cy={O[1]} r={75} fill="currentColor" fillOpacity={0.06} />
      <Line a={O} b={A} />
      <Line a={O} b={B} />
      <Line a={C} b={A} c={HI3} />
      <Line a={C} b={B} c={HI3} />
      <Arc c={O} r={75} a1={210} a2={330} color={HI} w={4} />
      <AngArc v={O} p={A} q={B} r={20} color={HI2} label="2θ" />
      <AngArc v={C} p={A} q={B} r={22} color={HI3} label="θ" />
      <Dot p={O} />
      <T x={A[0] - 10} y={A[1] + 14} c={FG}>
        A
      </T>
      <T x={B[0] + 10} y={B[1] + 14} c={FG}>
        B
      </T>
      <T x={C[0]} y={C[1] - 7} c={FG}>
        C
      </T>
      <T x={O[0] + 8} y={O[1] - 4} c={FG}>
        O
      </T>
    </Svg>
  );
}

function ChordTangentSecant() {
  const O: P = [140, 100];
  const r = 60;
  return (
    <Svg label="Circle with a tangent, a chord and a secant">
      <circle cx={O[0]} cy={O[1]} r={r} fill="currentColor" fillOpacity={0.06} />
      <Line a={[50, 40]} b={[230, 40]} c={HI2} />
      <Line a={O} b={[O[0], O[1] - r]} />
      <Right p={[O[0], 40]} u={[1, 0]} v={[0, 1]} a={9} />
      <Line a={[83.6, 120.5]} b={[196.4, 120.5]} c={HI} w={3} />
      <Line a={[196.4, 120.5]} b={[300, 120.5]} c={HI} dash w={1.4} />
      <Dot p={O} />
      <Dot p={[O[0], 40]} c={HI2} />
      <T x={70} y={32} c={HI2}>
        tangent
      </T>
      <T x={O[0] + 12} y={72}>
        r
      </T>
      <T x={O[0]} y={142} c={HI}>
        chord
      </T>
      <T x={262} y={112} c={HI}>
        secant
      </T>
    </Svg>
  );
}

function CircleEquation() {
  const O: P = [40, 170];
  const Cn: P = [130, 100];
  const X: P = [Cn[0] + 42, Cn[1] - 42];
  return (
    <Svg label="Circle with center (h, k) and radius r on coordinate axes">
      <Line a={[20, 170]} b={[300, 170]} c={MUT} w={1.2} />
      <Line a={O} b={[40, 10]} c={MUT} w={1.2} />
      <circle cx={Cn[0]} cy={Cn[1]} r={60} fill="currentColor" fillOpacity={0.06} />
      <Line a={[Cn[0], 170]} b={Cn} c={MUT} dash w={1.2} />
      <Line a={[40, Cn[1]]} b={Cn} c={MUT} dash w={1.2} />
      <Line a={Cn} b={X} c={HI} />
      <Dot p={Cn} />
      <Dot p={X} c={HI} />
      <T x={Cn[0] - 8} y={Cn[1] + 16} c={FG}>
        (h, k)
      </T>
      <T x={X[0] + 26} y={X[1] - 4} c={HI}>
        (x, y)
      </T>
      <T x={Cn[0] + 24} y={Cn[1] - 26} c={HI}>
        r
      </T>
      <T x={Cn[0]} y={184}>
        h
      </T>
      <T x={28} y={Cn[1] + 4}>
        k
      </T>
      <T x={316} y={20} anchor="end" size={11}>
        {"(x−h)² + (y−k)² = r²"}
      </T>
    </Svg>
  );
}

/* ───────────── 09 Area ───────────── */

function ParallelogramArea() {
  const A: P = [50, 150];
  const B: P = [210, 150];
  const C: P = [270, 60];
  const D: P = [110, 60];
  return (
    <Svg label="Parallelogram with base and height, cut into two triangles">
      <Poly pts={[A, B, C, D]} />
      <Line a={A} b={C} c={HI} dash />
      <Line a={D} b={[110, 150]} c={HI2} dash />
      <Right p={[110, 150]} u={[-1, 0]} v={[0, -1]} a={8} />
      <T x={130} y={168} c={FG}>
        b
      </T>
      <T x={100} y={108} c={HI2}>
        h
      </T>
      <T x={185} y={20}>
        {"A = b · h"}
      </T>
    </Svg>
  );
}

function TrapezoidRegular() {
  const c: P = [245, 100];
  const v: P[] = Array.from({ length: 6 }, (_, i): P => [
    c[0] + 55 * Math.cos(rad(i * 60)),
    c[1] - 55 * Math.sin(rad(i * 60)),
  ]);
  const foot: P = mid(v[3], v[4]);
  return (
    <Svg label="Trapezoid with bases and height, and a regular hexagon with apothem">
      <Poly
        pts={[
          [15, 145],
          [135, 145],
          [110, 55],
          [45, 55],
        ]}
      />
      <Line a={[45, 55]} b={[45, 145]} c={HI2} dash />
      <Right p={[45, 145]} u={[1, 0]} v={[0, -1]} a={8} />
      <T x={78} y={46}>
        b₁
      </T>
      <T x={75} y={163}>
        b₂
      </T>
      <T x={34} y={104} c={HI2}>
        h
      </T>
      <Poly pts={v} />
      <Line a={c} b={foot} c={HI} />
      <Dot p={c} />
      <T x={c[0] + 8} y={c[1] + 22} c={HI}>
        a
      </T>
      <T x={c[0]} y={foot[1] + 16}>
        s
      </T>
    </Svg>
  );
}

function SectorArea() {
  const O: P = [160, 100];
  const r = 70;
  const end: P = [O[0] + r * Math.cos(rad(70)), O[1] - r * Math.sin(rad(70))];
  return (
    <Svg label="Circle with a shaded sector of angle theta">
      <circle cx={O[0]} cy={O[1]} r={r} />
      <path
        d={`M${O} L${O[0] + r},${O[1]} A${r},${r} 0 0 0 ${end} Z`}
        fill={HI}
        fillOpacity={0.25}
        stroke={HI}
      />
      <Arc c={O} r={24} a1={0} a2={70} color={HI2} />
      <Dot p={O} />
      <T x={O[0] + 34} y={O[1] - 6} c={HI2}>
        θ
      </T>
      <T x={O[0] + 40} y={O[1] + 16}>
        r
      </T>
      <T x={160} y={186} c={HI}>
        {"A = ½ r² θ"}
      </T>
    </Svg>
  );
}

function CompositeFigure() {
  return (
    <Svg label="A rectangle with a semicircle attached, split by a dashed line">
      <path d="M70,80 H180 A40,40 0 0 1 180,160 H70 Z" fill="currentColor" fillOpacity={0.1} />
      <Line a={[180, 80]} b={[180, 160]} c={HI} dash />
      <T x={120} y={124} c={HI2}>
        rectangle
      </T>
      <T x={228} y={124} c={HI3} anchor="start">
        semicircle
      </T>
      <T x={160} y={182} c={HI}>
        total = rectangle + semicircle
      </T>
    </Svg>
  );
}

/* ───────────── 10 Solids ───────────── */

function PrismCylinder() {
  const front: P[] = [
    [20, 90],
    [110, 90],
    [110, 155],
    [20, 155],
  ];
  const o: P = [30, -30];
  const back = front.map((p): P => [p[0] + o[0], p[1] + o[1]]);
  return (
    <Svg label="Rectangular prism and cylinder">
      <Poly pts={front} />
      <Poly pts={[front[0], back[0], back[1], front[1]]} fill={0.18} />
      <Poly pts={[front[1], back[1], back[2], front[2]]} fill={0.05} />
      <Line a={back[3]} b={front[3]} c={MUT} dash w={1.2} />
      <Line a={back[3]} b={back[2]} c={MUT} dash w={1.2} />
      <Line a={back[3]} b={back[0]} c={MUT} dash w={1.2} />
      <T x={65} y={172}>
        l
      </T>
      <T x={9} y={126}>
        h
      </T>
      <T x={126} y={73}>
        w
      </T>
      <ellipse cx={240} cy={55} rx={45} ry={14} fill="currentColor" fillOpacity={0.18} />
      <path d="M195,55 V140 A45,14 0 0 0 285,140 V55" />
      <path
        d="M195,140 A45,14 0 0 1 285,140"
        stroke={MUT}
        strokeDasharray="5 4"
        strokeWidth={1.2}
      />
      <Line a={[240, 55]} b={[285, 55]} c={HI} />
      <T x={264} y={71} c={HI}>
        r
      </T>
      <T x={300} y={100}>
        h
      </T>
    </Svg>
  );
}

function PyramidCone() {
  const f0: P = [30, 145];
  const f1: P = [110, 145];
  const b1: P = [150, 120];
  const b0: P = [70, 120];
  const apex: P = [90, 30];
  return (
    <Svg label="Square pyramid and cone with height and slant height">
      <Poly pts={[f0, f1, apex]} fill={0.15} />
      <Poly pts={[f1, b1, apex]} fill={0.06} />
      <Line a={f0} b={f1} />
      <Line a={f1} b={b1} />
      <Line a={b0} b={f0} c={MUT} dash w={1.2} />
      <Line a={b0} b={b1} c={MUT} dash w={1.2} />
      <Line a={b0} b={apex} c={MUT} dash w={1.2} />
      <Line a={apex} b={[90, 132]} c={HI2} dash />
      <T x={100} y={95} c={HI2}>
        h
      </T>
      <T x={38} y={82} c={HI}>
        l
      </T>
      <path d="M195,145 L240,30 L285,145" fill="currentColor" fillOpacity={0.1} />
      <path d="M195,145 A45,14 0 0 0 285,145" />
      <path
        d="M195,145 A45,14 0 0 1 285,145"
        stroke={MUT}
        strokeDasharray="5 4"
        strokeWidth={1.2}
      />
      <Line a={[240, 30]} b={[240, 145]} c={HI2} dash />
      <Line a={[240, 145]} b={[285, 145]} c={HI} />
      <T x={228} y={92} c={HI2}>
        h
      </T>
      <T x={263} y={136} c={HI}>
        r
      </T>
      <T x={280} y={88} c={HI}>
        l
      </T>
    </Svg>
  );
}

function SphereDiagram() {
  const O: P = [160, 95];
  return (
    <Svg label="Sphere with center and radius">
      <circle cx={O[0]} cy={O[1]} r={70} fill="currentColor" fillOpacity={0.08} />
      <path d="M90,95 A70,20 0 0 0 230,95" />
      <path d="M90,95 A70,20 0 0 1 230,95" stroke={MUT} strokeDasharray="5 4" strokeWidth={1.2} />
      <Line a={O} b={[209.5, 45.5]} c={HI} />
      <Dot p={O} />
      <T x={196} y={62} c={HI}>
        r
      </T>
      <T x={160} y={186} c={HI}>
        {"V = 4/3 π r³   S = 4π r²"}
      </T>
    </Svg>
  );
}

function SimilarSolids() {
  const cube = (x: number, y: number, s: number, key: string) => {
    const o = s * 0.35;
    return (
      <g key={key}>
        <Poly
          pts={[
            [x, y],
            [x + s, y],
            [x + s, y + s],
            [x, y + s],
          ]}
          fill={0.12}
        />
        <Poly
          pts={[
            [x, y],
            [x + o, y - o],
            [x + s + o, y - o],
            [x + s, y],
          ]}
          fill={0.2}
        />
        <Poly
          pts={[
            [x + s, y],
            [x + s + o, y - o],
            [x + s + o, y + s - o],
            [x + s, y + s],
          ]}
          fill={0.06}
        />
      </g>
    );
  };
  return (
    <Svg label="Two similar cubes with side ratio 1 to 2">
      {cube(15, 115, 40, "s")}
      {cube(100, 65, 85, "l")}
      <T x={35} y={172}>
        a
      </T>
      <T x={142} y={172}>
        2a
      </T>
      <T x={226} y={95} c={HI} anchor="start" size={11}>
        {"sides 1 : 2"}
      </T>
      <T x={226} y={117} c={HI2} anchor="start" size={11}>
        {"areas 1 : 4"}
      </T>
      <T x={226} y={139} c={HI3} anchor="start" size={11}>
        {"volumes 1 : 8"}
      </T>
    </Svg>
  );
}

export const diagrams: Record<string, () => ReactNode> = {
  "points-lines-planes": PointsLinesPlanes,
  "distance-midpoint": DistanceMidpoint,
  "angle-basics": AngleBasics,
  conditional: ConditionalVenn,
  transversal: Transversal,
  "slopes-pp": SlopesPP,
  constructions: Constructions,
  "triangle-sum": TriangleSumExterior,
  "congruence-postulates": CongruencePostulates,
  cpctc: Cpctc,
  isosceles: IsoscelesTriangle,
  "similar-polygons": () => <SimilarTriangles sides />,
  "similar-triangles": () => <SimilarTriangles sides={false} />,
  "side-splitter": SideSplitter,
  "scale-ratios": ScaleRatios,
  pythagorean: Pythagorean,
  "special-right": SpecialRight,
  trig: TrigRatios,
  elevation: ElevationDepression,
  "polygon-angles": PolygonAngles,
  parallelogram: ParallelogramDiagram,
  "special-parallelograms": SpecialParallelograms,
  "trapezoid-kite": TrapezoidKite,
  "arc-length": ArcLength,
  "central-inscribed": CentralInscribed,
  "chord-tangent-secant": ChordTangentSecant,
  "circle-equation": CircleEquation,
  "parallelogram-area": ParallelogramArea,
  "trapezoid-regular": TrapezoidRegular,
  "sector-area": SectorArea,
  composite: CompositeFigure,
  "prism-cylinder": PrismCylinder,
  "pyramid-cone": PyramidCone,
  sphere: SphereDiagram,
  "similar-solids": SimilarSolids,
};
