import { Link } from "react-router-dom";
import { Scissors } from "lucide-react";
import { BARBEIROS } from "@/data/barbearia";

const Profissionais = () => (
  <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
    <header className="text-center space-y-2">
      <h1 className="text-3xl sm:text-4xl font-black text-gold">Profissionais</h1>
      <p className="text-muted-foreground text-sm">Escolha o barbeiro e agende direto com ele.</p>
    </header>

    <div className="grid gap-5 sm:grid-cols-2">
      {BARBEIROS.map((b, i) => (
        <article
          key={b.id}
          style={{ animationDelay: `${i * 80}ms` }}
          className="card-anim bg-card border border-gold-subtle rounded-2xl p-6 flex flex-col items-center text-center gap-3"
        >
          {b.foto ? (
            <img src={b.foto} alt={`Barbeiro ${b.nome}`} className="w-24 h-24 rounded-full object-cover ring-2 ring-gold/40" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center ring-2 ring-gold/40">
              <Scissors className="w-8 h-8 text-gold" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-foreground">{b.nome}</h2>
            <p className="text-gold text-sm font-medium">{b.especialidade}</p>
          </div>
          <p className="text-muted-foreground text-sm">{b.descricao}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {b.servicos.map((s) => (
              <span key={s} className="text-[11px] text-gold bg-gold/10 px-2.5 py-1 rounded-full">{s}</span>
            ))}
          </div>
          <Link
            to={`/agendamento?barbeiro=${b.id}`}
            className="mt-2 w-full gradient-gold text-primary-foreground font-bold py-3 rounded-xl text-sm"
          >
            AGENDAR COM {b.nome.toUpperCase()}
          </Link>
        </article>
      ))}
    </div>
  </div>
);

export default Profissionais;
