import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { Servico } from "@/data/barbearia";

const ServicoCard = ({ servico, index = 0 }: { servico: Servico; index?: number }) => {
  const navigate = useNavigate();
  return (
    <article
      style={{ animationDelay: `${index * 60}ms` }}
      className="card-anim bg-card border border-gold-subtle rounded-2xl p-5 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-foreground font-bold text-lg leading-tight">{servico.nome}</h3>
        <span className="text-[10px] uppercase tracking-widest text-gold bg-gold/10 px-2 py-1 rounded-full shrink-0">
          {servico.categoria}
        </span>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed flex-1">{servico.descricao}</p>
      <div className="flex items-center justify-between pt-1">
        <span className="text-gold text-xl font-black">{servico.preco}</span>
        <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <Clock className="w-3.5 h-3.5" />
          {servico.duracao}
        </span>
      </div>
      <button
        onClick={() => navigate(`/agendamento?servico=${servico.id}`)}
        className="w-full gradient-gold text-primary-foreground font-bold py-2.5 rounded-xl text-sm tracking-wide hover:opacity-90 transition-opacity"
      >
        AGENDAR
      </button>
    </article>
  );
};

export default ServicoCard;
