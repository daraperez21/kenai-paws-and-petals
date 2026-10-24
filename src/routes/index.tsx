import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import kenai from "@/assets/kenai.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Altar de Kenai · Día de Muertos" },
      { name: "description", content: "Un altar digital interactivo para recordar a Kenai, mi perrito grande, blanco y de cabeza negra." },
      { property: "og:title", content: "Altar de Kenai · Día de Muertos" },
      { property: "og:description", content: "Enciende una veladora, lánzale su pelota y déjale croquetas a Kenai." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const PAPEL = ["bg-secondary", "bg-primary", "bg-teal", "bg-accent", "bg-secondary", "bg-primary", "bg-teal", "bg-accent"];

function PapelPicado() {
  return (
    <div className="relative flex w-full justify-between gap-1 px-1">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-wax/60" />
      {PAPEL.map((c, i) => (
        <div key={i} className={`${c} animate-sway h-16 flex-1 sm:h-24`} style={{ animationDelay: `${i * 0.3}s`, clipPath: "polygon(0 0,100% 0,100% 85%,90% 100%,80% 85%,70% 100%,60% 85%,50% 100%,40% 85%,30% 100%,20% 85%,10% 100%,0 85%)" }}>
          <div className="grid h-full grid-cols-3 place-items-center p-2 opacity-90">
            {Array.from({ length: 6 }).map((_, j) => (
              <span key={j} className="block h-2 w-2 rotate-45 bg-background sm:h-3 sm:w-3" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Petals({ burst }: { burst: number }) {
  const [petals, setPetals] = useState<{ id: number; left: number; dur: number; size: number }[]>([]);
  useEffect(() => {
    const n = burst ? 30 : 14;
    setPetals(Array.from({ length: n }, (_, i) => ({ id: burst * 100 + i, left: Math.random() * 100, dur: 6 + Math.random() * 6, size: 8 + Math.random() * 10 })));
  }, [burst]);
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {petals.map((p) => (
        <span key={p.id} className="animate-fall absolute -top-6 rounded-full bg-primary" style={{ left: `${p.left}%`, width: p.size, height: p.size * 0.7, animationDuration: `${p.dur}s`, animationDelay: `${Math.random() * 3}s` }} />
      ))}
    </div>
  );
}

function Veladora({ lit, onClick }: { lit: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label={lit ? "Apagar veladora" : "Encender veladora"} className="group flex flex-col items-center">
      <div className="h-8 w-4">
        {lit && <div className="animate-flicker mx-auto h-8 w-4 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-flame shadow-glow" />}
      </div>
      <div className="h-1 w-0.5 bg-foreground" />
      <div className={`h-14 w-9 rounded-t-sm bg-wax transition ${lit ? "" : "opacity-70 group-hover:opacity-100"}`}>
        <div className="mt-4 h-3 w-full bg-secondary" />
      </div>
    </button>
  );
}

function Index() {
  const [candles, setCandles] = useState([false, false, false, false, false]);
  const [croquetas, setCroquetas] = useState(0);
  const [throwing, setThrowing] = useState(false);
  const [hug, setHug] = useState(false);
  const [burst, setBurst] = useState(0);
  const [msg, setMsg] = useState("");
  const [notes, setNotes] = useState<string[]>(["Te extraño cada día, mi niño peludo."]);
  const allLit = candles.every(Boolean);

  useEffect(() => { if (allLit) setBurst((b) => b + 1); }, [allLit]);

  const say = throwing ? "¡Guau! ¡Mi pelota!" : hug ? "¡Mi peluche favorito! 💛" : croquetas > 0 ? `¡Ñam! ${croquetas} croqueta${croquetas > 1 ? "s" : ""}` : allLit ? "Veo la luz, ya vengo a casa 🐾" : "Enciende mis veladoras para guiarme…";

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Petals burst={burst} />
      <div className="relative z-10">
        <PapelPicado />

        <header className="px-6 pt-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Día de Muertos</p>
          <h1 className="mt-2 font-display text-6xl text-foreground sm:text-8xl">Kenai</h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">Grande, blanco, de cabeza negra y con muchísimo pelo. Este altar es para que encuentre el camino de regreso.</p>
        </header>

        {/* Altar */}
        <section className="mx-auto mt-10 max-w-3xl px-4">
          <div className="relative mx-auto w-64 sm:w-80">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-4 py-1 text-sm text-secondary-foreground shadow-lg">{say}</div>
            <div className={`overflow-hidden rounded-[2rem] border-8 border-primary ${allLit ? "shadow-glow" : ""} transition-shadow duration-700`}>
              <img src={kenai} alt="Retrato de Kenai, perrito grande blanco con cabeza negra" width={896} height={1152} className="block h-auto w-full" />
            </div>
          </div>

          {/* Escalones */}
          <div className="mt-6 rounded-t-2xl bg-card px-4 pt-6 pb-4">
            <div className="flex justify-center gap-4 sm:gap-8">
              {candles.map((l, i) => (
                <Veladora key={i} lit={l} onClick={() => setCandles((c) => c.map((v, j) => (j === i ? !v : v)))} />
              ))}
            </div>
          </div>
          <div className="mx-[-0.5rem] rounded-b-2xl bg-muted px-4 py-6">
            <div className="flex items-end justify-around">
              <button onClick={() => { setThrowing(true); setTimeout(() => setThrowing(false), 1400); }} className="flex flex-col items-center gap-2" aria-label="Lanzar pelota">
                <span className={`block h-14 w-14 rounded-full bg-accent ${throwing ? "animate-ball" : ""}`} style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent 0 10px, var(--secondary) 10px 14px)" }} />
                <span className="text-xs text-muted-foreground">Pelota</span>
              </button>

              <button onClick={() => { setHug(true); setTimeout(() => setHug(false), 1500); }} className="flex flex-col items-center gap-2" aria-label="Abrazar peluche">
                <span className={`relative block h-16 w-14 ${hug ? "animate-pop" : ""}`}>
                  <span className="absolute left-0 top-0 h-5 w-5 rounded-full bg-primary" />
                  <span className="absolute right-0 top-0 h-5 w-5 rounded-full bg-primary" />
                  <span className="absolute left-1 top-2 h-12 w-12 rounded-full bg-primary" />
                  <span className="absolute left-4 top-6 h-2 w-2 rounded-full bg-background" />
                  <span className="absolute right-4 top-6 h-2 w-2 rounded-full bg-background" />
                </span>
                <span className="text-xs text-muted-foreground">Peluche</span>
              </button>

              <button onClick={() => setCroquetas((n) => n + 1)} className="flex flex-col items-center gap-2" aria-label="Servir croquetas">
                <span className="relative block h-14 w-20">
                  <span className="absolute inset-x-0 bottom-0 h-8 rounded-b-full bg-secondary" />
                  <span className="absolute inset-x-2 bottom-6 flex flex-wrap-reverse justify-center gap-0.5">
                    {Array.from({ length: Math.min(croquetas * 3, 18) }).map((_, i) => (
                      <span key={i} className="block h-2.5 w-2.5 rounded-full bg-primary" />
                    ))}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground">Croquetas ({croquetas})</span>
              </button>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">Toca las veladoras, la pelota, el peluche y el plato.</p>
        </section>

        {/* Mensajes */}
        <section className="mx-auto mt-16 max-w-xl px-6 pb-20">
          <h2 className="text-center font-display text-3xl text-primary">Déjale un mensaje</h2>
          <form className="mt-6 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!msg.trim()) return; setNotes((n) => [msg.trim(), ...n]); setMsg(""); setBurst((b) => b + 1); }}>
            <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Para Kenai…" className="flex-1 rounded-full border bg-card px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring" />
            <button className="rounded-full bg-primary px-5 py-2 font-semibold text-primary-foreground">Enviar</button>
          </form>
          <ul className="mt-6 space-y-3">
            {notes.map((n, i) => (
              <li key={i} className="rounded-xl border-l-4 border-secondary bg-card px-4 py-3 text-card-foreground">🌼 {n}</li>
            ))}
          </ul>
        </section>

        <footer className="pb-8 text-center text-sm text-muted-foreground">Hecho con amor para Kenai 🐾</footer>
      </div>
    </main>
  );
}
