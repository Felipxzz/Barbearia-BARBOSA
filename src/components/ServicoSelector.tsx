import { Button } from "@/components/ui/button";
interface Servico {
  id: string;
  nome: string;
  preco: string;
  duracao?: string;
}

interface Props {
  servicos: Servico[];
  selected: string[];
  onToggle: (id: string) => void;
}

const ServicoSelector = ({ servicos, selected, onToggle }: Props) => (
  <section>
    <h2 className="text-gold text-lg font-bold mb-3">Escolha o(s) Serviço(s)</h2>
    <div className="flex flex-col gap-2.5">
      {servicos.map((s, i) => {
        const isSelected = selected.includes(s.id);
        return (
          <Button variant="ghost"
            key={s.id}
            aria-pressed={isSelected}
            onClick={() => onToggle(s.id)}
            style={{ animationDelay: `${i * 60}ms` }}
            className={`card-anim barbosa-option p-4 rounded-xl text-left text-sm font-medium border flex items-center gap-3 ${
              isSelected
                ? "gradient-gold text-primary-foreground border-transparent font-bold card-selected"
                : "bg-card text-foreground border-gold-subtle"
            }`}
          >
            <span className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
              isSelected ? "border-primary-foreground bg-primary-foreground/20" : "border-muted-foreground"
            }`}>
              {isSelected && <span className="text-primary-foreground text-xs animate-scale-in">✓</span>}
            </span>
            <span className="flex-1 min-w-0">{s.nome}{s.duracao && <small className="block text-xs opacity-70 mt-1">{s.duracao}</small>}</span><strong className="shrink-0">{s.preco}</strong>
          </Button>
        );
      })}
    </div>
  </section>
);

export default ServicoSelector;
