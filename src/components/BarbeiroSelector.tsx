
import { Button } from "@/components/ui/button";
import BarberPhoto from "@/components/BarberPhoto";

interface Barbeiro {
  id: string;
  nome: string;
  foto?: string;
}

interface Props {
  barbeiros: Barbeiro[];
  selected: string;
  onSelect: (id: string) => void;
}

const FOTOS: Record<string, string> = {
  ryan: "/images/IMG_9237.jpeg",
  kauan: "/images/IMG_9236.jpeg",
};

const BarbeiroSelector = ({
  barbeiros,
  selected,
  onSelect,
}: Props) => (
  <section>
    <h2 className="text-gold text-lg font-bold mb-3">
      Escolha o Barbeiro
    </h2>

    <div className="flex flex-col gap-2.5">
      {barbeiros.map((b, i) => (
        <Button
          variant="ghost"
          key={b.id}
          aria-label={b.nome}
          aria-pressed={selected === b.id}
          onClick={() => onSelect(b.id)}
          style={{ animationDelay: `${i * 80}ms` }}
          className={`card-anim barbosa-option group p-4 rounded-xl text-left text-sm font-medium border flex items-center gap-3 ${
            selected === b.id
              ? "gradient-gold text-primary-foreground border-transparent font-bold card-selected"
              : "bg-card text-foreground border-gold-subtle"
          }`}
        >
          <span className="w-12 h-12 shrink-0 rounded-full overflow-hidden">
            <BarberPhoto
              src={FOTOS[b.id] ?? b.foto}
              name={b.nome}
              className={`w-12 h-12 rounded-full object-cover transition-transform duration-300 group-hover:scale-110 ${
                i === 0 ? "barber-photo-zoom" : ""
              }`}
            />
          </span>

          <span>{b.nome}</span>
        </Button>
      ))}
    </div>
  </section>
);

export default BarbeiroSelector;
