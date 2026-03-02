interface Props {
  dias: Date[];
  selected: string;
  onSelect: (dia: string) => void;
}

const DIAS_SEMANA: Record<number, string> = {
  0: "dom",
  1: "seg",
  2: "ter",
  3: "qua",
  4: "qui",
  5: "sexta",
  6: "sáb",
};

const DiaSelector = ({ dias, selected, onSelect }: Props) => (
  <section>
    <h2 className="text-gold text-lg font-bold mb-3">Escolha o Dia</h2>
    <div className="flex overflow-x-auto gap-2.5 pb-2 -mx-1 px-1">
      {dias.map((d) => {
        const dataStr = d.toISOString().split("T")[0];
        const dia = d.getDate();
        const mes = d.getMonth() + 1;
        const label = `${DIAS_SEMANA[d.getDay()]}., ${dia}/${mes}`;
        return (
          <button
            key={dataStr}
            onClick={() => onSelect(dataStr)}
            className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
              selected === dataStr
                ? "gradient-gold text-primary-foreground font-bold"
                : "bg-card text-foreground hover:scale-105"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  </section>
);

export default DiaSelector;
