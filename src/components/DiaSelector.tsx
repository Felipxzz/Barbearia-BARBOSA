import { Button } from "@/components/ui/button";
import { localDay } from "@/lib/admin";
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
      {dias.map((d, i) => {
        const dataStr = localDay(d);
        const dia = d.getDate();
        const mes = d.getMonth() + 1;
        const label = `${DIAS_SEMANA[d.getDay()]}., ${dia}/${mes}`;
        return (
          <Button variant="ghost"
            key={dataStr}
            onClick={() => onSelect(dataStr)}
            style={{ animationDelay: `${i * 45}ms` }}
            className={`card-anim barbosa-option flex-shrink-0 px-4 py-3 rounded-xl text-sm border border-transparent ${
              selected === dataStr
                ? "gradient-gold text-primary-foreground font-bold card-selected"
                : "bg-card text-foreground"
            }`}
          >
            {label}
          </Button>
        );
      })}
    </div>
  </section>
);

export default DiaSelector;
