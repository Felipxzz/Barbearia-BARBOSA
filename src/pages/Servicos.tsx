import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { SERVICOS, CATEGORIAS } from "@/data/barbearia";
import ServicoCard from "@/components/ServicoCard";

const Servicos = () => {
  const [cat, setCat] = useState<string>("todos");
  const [busca, setBusca] = useState("");

  const lista = useMemo(
    () =>
      SERVICOS.filter((s) => cat === "todos" || s.categoria === cat).filter((s) =>
        (s.nome + s.descricao).toLowerCase().includes(busca.toLowerCase())
      ),
    [cat, busca]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-gold">Serviços</h1>
        <p className="text-muted-foreground text-sm">Preços e durações reais da Barbearia Barbosa.</p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                cat === c.id
                  ? "gradient-gold text-primary-foreground border-transparent font-bold"
                  : "bg-card text-muted-foreground border-gold-subtle hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar serviço"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-card border border-gold-subtle text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((s, i) => (
          <ServicoCard key={s.id} servico={s} index={i} />
        ))}
      </div>
      {lista.length === 0 && (
        <p className="text-center text-muted-foreground py-10">Nenhum serviço encontrado.</p>
      )}
    </div>
  );
};

export default Servicos;
