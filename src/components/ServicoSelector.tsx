interface Servico {
  id: string;
  nome: string;
  preco: string;
}

interface Props {
  servicos: Servico[];
  selected: string;
  onSelect: (id: string) => void;
}

const ServicoSelector = ({ servicos, selected, onSelect }: Props) => (
  <section>
    <h2 className="text-gold text-lg font-bold mb-3">Escolha o Serviço</h2>
    <div className="flex flex-col gap-2.5">
      {servicos.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`p-4 rounded-xl text-left text-sm font-medium transition-all duration-200 border ${
            selected === s.id
              ? "gradient-gold text-primary-foreground border-transparent font-bold"
              : "bg-card text-foreground border-gold-subtle hover:scale-[1.02]"
          }`}
        >
          {s.nome} – {s.preco}
        </button>
      ))}
    </div>
  </section>
);

export default ServicoSelector;
