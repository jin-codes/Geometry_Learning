import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { chapters } from "@/data/chapters";
import { TeX } from "@/components/TeX";
import { interactives } from "@/components/Interactives";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Geometry Reference — 10th Grade" },
      {
        name: "description",
        content:
          "The full 10th-grade Geometry curriculum, distilled. Ten chapters, every core theorem and formula, rendered with KaTeX in a dark study reference.",
      },
      { property: "og:title", content: "Geometry Reference — 10th Grade" },
      {
        property: "og:description",
        content:
          "The full 10th-grade Geometry curriculum, distilled. Ten chapters, every core theorem and formula, rendered with KaTeX in a dark study reference.",
      },
    ],
  }),
  component: Index,
});

const accentClass: Record<string, string> = {
  cyan: "text-primary",
  magenta: "text-[color:var(--accent-magenta)]",
  green: "text-[color:var(--accent-green)]",
  amber: "text-[color:var(--accent-amber)]",
};

function Index() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(chapters[0].id);

  // Scroll spy
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const c of chapters) {
      const el = document.getElementById(c.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return chapters;
    return chapters
      .map((c) => ({
        ...c,
        topics: c.topics.filter(
          (t) =>
            t.title.toLowerCase().includes(query) ||
            t.body.toLowerCase().includes(query) ||
            (t.formulas || []).some((f) => f.toLowerCase().includes(query)),
        ),
      }))
      .filter(
        (c) =>
          c.topics.length > 0 ||
          c.title.toLowerCase().includes(query) ||
          c.short.toLowerCase().includes(query),
      );
  }, [q]);

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-border/70 bg-background/60 backdrop-blur-md lg:flex lg:flex-col">
        <div className="border-b border-border/70 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md border border-border bg-card">
              <span className="font-mono text-lg text-primary">△</span>
            </div>
            <div>
              <div className="text-base font-semibold tracking-tight">
                Geometry <span className="text-primary">10</span>
              </div>
              <div className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                REFERENCE
              </div>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {chapters.map((c) => {
            const isActive = active === c.id;
            return (
              <a
                key={c.id}
                href={`#${c.id}`}
                className={`mb-1 flex gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                  isActive ? "bg-card/80 ring-1 ring-primary/50" : "hover:bg-card/50"
                }`}
              >
                <span className={`font-mono text-xs ${accentClass[c.accent]}`}>{c.num}</span>
                <span className={isActive ? "text-foreground" : "text-muted-foreground"}>
                  {c.title}
                </span>
              </a>
            );
          })}
        </nav>
        <div className="border-t border-border/70 px-6 py-4 font-mono text-[10px] leading-relaxed text-muted-foreground">
          Built with KaTeX · Dark neon study reference
        </div>
      </aside>

      {/* Main */}
      <main className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-20 border-b border-border/70 bg-background/70 backdrop-blur-md">
          <div className="flex items-center gap-4 px-6 py-4 lg:px-12">
            <div className="hidden text-sm text-muted-foreground lg:block">
              Geometry 10 <span className="text-foreground">Reference</span>
            </div>
            <div className="ml-auto w-full max-w-xl">
              <div className="relative">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search topics, theorems, keywords…"
                  className="w-full rounded-full border border-border bg-card/60 px-11 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-muted-foreground">
                  ⌕
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero */}
        <section className="px-6 pt-12 pb-16 lg:px-12 lg:pt-20">
          <div className="font-mono text-xs tracking-[0.25em] text-[color:var(--accent-magenta)]">
            // STUDY REFERENCE
          </div>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            The full <span className="text-primary">Geometry</span> curriculum, distilled.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Ten chapters, every core theorem and formula, rendered with KaTeX. Built as a clean,
            dark-mode reference for studying or revisiting any topic on demand.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {chapters.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="rounded-full border border-border bg-card/50 px-3.5 py-1.5 font-mono text-xs text-muted-foreground transition hover:border-primary/60 hover:text-foreground"
              >
                <span className={accentClass[c.accent]}>{c.num}</span>
                <span className="mx-1.5">·</span>
                {c.short}
              </a>
            ))}
          </div>
        </section>

        {/* Chapters */}
        <div className="space-y-24 px-6 pb-24 lg:px-12">
          {filtered.map((c, idx) => {
            const inter = interactives[chapters.findIndex((x) => x.id === c.id)];
            return (
              <section key={c.id} id={c.id} className="scroll-mt-24">
                <div className="mb-8 flex items-baseline gap-6 border-b border-border/70 pb-4">
                  <span className={`font-mono text-sm ${accentClass[c.accent]}`}>{c.num}</span>
                  <h2
                    className={`text-3xl font-semibold tracking-tight sm:text-4xl ${accentClass[c.accent]}`}
                  >
                    {c.title}
                  </h2>
                </div>

                <div className="space-y-6">
                  {c.topics.map((t) => (
                    <article
                      key={t.title}
                      className="rounded-xl border border-border bg-card/50 p-6 sm:p-8"
                    >
                      <h3
                        className={`text-xl font-semibold tracking-tight ${accentClass[c.accent]}`}
                      >
                        {t.title}
                      </h3>
                      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {t.body}
                      </p>

                      {t.formulas && t.formulas.length > 0 && (
                        <div className="mt-6">
                          <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                            <span>▤</span> Key Formulas
                          </div>
                          <div className="space-y-3 rounded-lg border border-border/60 bg-background/40 px-5 py-5">
                            {t.formulas.map((f, i) => (
                              <div key={i} className="overflow-x-auto text-lg">
                                <TeX math={f} block />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {t.examples?.map((ex, i) => (
                        <div
                          key={i}
                          className="mt-6 rounded-lg border border-border/60 bg-background/40 p-5"
                        >
                          <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                            ◇ Example {i + 1}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Problem:</span>{" "}
                            <span className="text-foreground">{ex.problem}</span>
                          </div>
                          <ol className="mt-3 list-inside list-decimal space-y-1.5 text-sm text-foreground/90">
                            {ex.steps.map((s, j) => (
                              <li key={j}>
                                <TeX math={s} />
                              </li>
                            ))}
                          </ol>
                        </div>
                      ))}
                    </article>
                  ))}
                </div>

                {inter && (
                  <div className="mt-10 rounded-xl border border-primary/30 bg-card/40 p-6 sm:p-8">
                    <div className="mb-1 font-mono text-[11px] uppercase tracking-widest text-primary">
                      Interactive · {inter.title}
                    </div>
                    <p className="mb-6 max-w-2xl text-sm text-muted-foreground">{inter.blurb}</p>
                    <inter.Comp />
                  </div>
                )}
              </section>
            );
          })}

          {filtered.length === 0 && (
            <div className="rounded-lg border border-border bg-card/40 p-10 text-center text-muted-foreground">
              No topics match “{q}”.
            </div>
          )}
        </div>

        <footer className="border-t border-border/70 px-6 py-10 font-mono text-[11px] text-muted-foreground lg:px-12">
          Geometry 10 Reference · Built with KaTeX · Study anywhere.
        </footer>
      </main>
    </div>
  );
}
