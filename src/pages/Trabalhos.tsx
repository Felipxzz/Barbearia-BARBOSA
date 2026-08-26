import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { TRABALHOS, Trabalho } from "@/data/barbearia";

const FILTROS = [
  { id: "todos", label: "Todos" },
  { id: "cortes", label: "Cortes" },
  { id: "barba", label: "Barbas" },
  { id: "combos", label: "Combos" },
  { id: "outros", label: "Outros" },
];

const Trabalhos = () => {
  const [filtro, setFiltro] = useState("todos");
  const [aberto, setAberto] = useState<Trabalho | null>(null);

  const lista = useMemo(
    () => TRABALHOS.filter((t) => filtro === "todos" || t.categoria === filtro),
    [filtro]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-gold">Trabalhos</h1>
        <p className="text-muted-foreground text-sm">Portfólio de cortes, barbas e combos realizados.</p>
      </header>

      <div className="flex flex-wrap justify-center gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFiltro(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              filtro === f.id
                ? "gradient-gold text-primary-foreground border-transparent font-bold"
                : "bg-card text-muted-foreground border-gold-subtle hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {lista.map((t, i) => (
          <button
            key={t.src + i}
            onClick={() => setAberto(t)}
            style={{ animationDelay: `${i * 40}ms` }}
            className="card-anim group relative overflow-hidden rounded-2xl border border-gold-subtle"
          >
            <img
              src={t.src}
              alt={`${t.nome} por ${t.profissional}`}
              loading="lazy"
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent p-3 text-left">
              <p className="text-foreground text-xs font-bold">{t.nome}</p>
              <p className="text-muted-foreground text-[11px]">{t.profissional}</p>
            </div>
          </button>
        ))}
      </div>

      {aberto && (
        <div
          onClick={() => setAberto(null)}
          className="fixed inset-0 z-[60] bg-background/95 flex items-center justify-center p-4"
        >
          <button className="absolute top-4 right-4 text-gold p-2" aria-label="Fechar">
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-xl w-full space-y-3" onClick={(e) => e.stopPropagation()}>
            <img src={aberto.src} alt={aberto.nome} className="w-full rounded-2xl border border-gold-subtle" />
            <div className="text-center">
              <p className="text-gold font-bold">{aberto.nome}</p>
              <p className="text-muted-foreground text-sm capitalize">
                {aberto.categoria} · {aberto.profissional}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trabalhos;
