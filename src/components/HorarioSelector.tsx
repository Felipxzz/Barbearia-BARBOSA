import { Button } from "@/components/ui/button";
import { useMemo } from "react";

interface Props {
  dia: string;
  selected: string;
  onSelect: (h: string) => void;
  horariosOcupados: string[];
}

const HorarioSelector = ({ dia, selected, onSelect, horariosOcupados }: Props) => {
  const horarios = useMemo(() => {
    const dataObj = new Date(dia + "T12:00:00");
    const diaSemana = dataObj.getDay();
    const inicio = diaSemana === 6 ? 8 : 14;
    const fim = 19;
    const result: string[] = [];
    for (let i = inicio; i <= fim; i++) {
      result.push((i < 10 ? "0" : "") + i + ":00");
    }
    return result;
  }, [dia]);

  return (
    <section>
      <h2 className="text-gold text-lg font-bold mb-3">Horários Disponíveis</h2>
      <div className="grid grid-cols-3 gap-2.5">
        {horarios.map((h, i) => {
          const ocupado = horariosOcupados.includes(h);
          return (
            <Button variant="ghost"
              key={h}
              onClick={() => !ocupado && onSelect(h)}
              disabled={ocupado}
              style={{ animationDelay: `${i * 40}ms` }}
              className={`card-anim barbosa-option py-3 rounded-lg text-sm border border-transparent ${
                ocupado
                  ? "bg-muted text-muted-foreground line-through opacity-50 cursor-not-allowed"
                  : selected === h
                  ? "gradient-gold text-primary-foreground font-bold card-selected"
                  : "bg-card text-foreground"
              }`}
            >
              {h}
            </Button>
          );
        })}
      </div>
    </section>
  );
};

export default HorarioSelector;
