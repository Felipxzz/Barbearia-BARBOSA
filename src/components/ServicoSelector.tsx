interface Servico {
  id: string;
  nome: string;
  preco: string;
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
      {servicos.map((s) => {
        const isSelected = selected.includes(s.id);
        return (
          <button
            key={s.id}
            onClick={() => onToggle(s.id)}
            className={`p-4 rounded-xl text-left text-sm font-medium transition-all duration-200 border flex items-center gap-3 ${
              isSelected
                ? "gradient-gold text-primary-foreground border-transparent font-bold"
                : "bg-card text-foreground border-gold-subtle hover:scale-[1.02]"
            }`}
          >
            <span className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
              isSelected ? "border-primary-foreground bg-primary-foreground/20" : "border-muted-foreground"
            }`}>
              {isSelected && <span className="text-primary-foreground text-xs">✓</span>}
            </span>
            {s.nome} – {s.preco}
          </button>
        );
      })}
    </div>
  </section>
);

export default ServicoSelector;
