
import { Button } from "@/components/ui/button";
import { localDay } from "@/lib/admin";

interface Props {
  dias: Date[];
  selected: string;
  onSelect: (dia: string) => void;
}

const DIAS_SEMANA = [
  "DOM",
  "SEG",
  "TER",
  "QUA",
  "QUI",
  "SEX",
  "SÁB",
];

const MESES = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
];

const DiaSelector = ({
  dias,
  selected,
  onSelect,
}: Props) => (
  <section className="my-6">
    <h2 className="text-gold text-lg font-bold mb-1">
      Escolha o Dia
    </h2>

    <p className="text-sm text-muted-foreground mb-4">
      Selecione uma data para consultar os horários disponíveis.
    </p>

    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
      {dias.map((d) => {
        const dataStr = localDay(d);
        const ativo = selected === dataStr;

        return (
          <Button
            key={dataStr}
            type="button"
            variant="ghost"
            aria-pressed={ativo}
            onClick={() => onSelect(dataStr)}
            className={`h-auto min-h-[94px] p-2 rounded-xl border flex flex-col gap-1 transition-all duration-200 ${
              ativo
                ? "gradient-gold text-primary-foreground border-transparent font-bold shadow-lg scale-[1.02]"
                : "bg-card text-foreground border-border hover:border-primary"
            }`}
          >
            <span className="text-[10px] font-bold tracking-wider">
              {DIAS_SEMANA[d.getDay()]}
            </span>

            <span className="text-2xl font-extrabold leading-none">
              {d.getDate()}
            </span>

            <span className="text-[10px] uppercase">
              {MESES[d.getMonth()]}
            </span>
          </Button>
        );
      })}
    </div>
  </section>
);

export default DiaSelector;
