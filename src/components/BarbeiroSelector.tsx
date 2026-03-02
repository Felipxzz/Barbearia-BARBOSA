import { Scissors } from "lucide-react";
import ryanImg from "@/assets/ryan.jpeg";
import muriloImg from "@/assets/murilo.jpeg";

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
  ryan: ryanImg,
  murilo: muriloImg,
};

const BarbeiroSelector = ({ barbeiros, selected, onSelect }: Props) => (
  <section>
    <h2 className="text-gold text-lg font-bold mb-3">Escolha o Barbeiro</h2>
    <div className="flex flex-col gap-2.5">
      {barbeiros.map((b) => (
        <button
          key={b.id}
          onClick={() => onSelect(b.id)}
          className={`p-4 rounded-xl text-left text-sm font-medium transition-all duration-200 border flex items-center gap-3 ${
            selected === b.id
              ? "gradient-gold text-primary-foreground border-transparent font-bold"
              : "bg-card text-foreground border-gold-subtle hover:scale-[1.02]"
          }`}
        >
          {FOTOS[b.id] ? (
            <img src={FOTOS[b.id]} alt={b.nome} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Scissors className="w-5 h-5" />
            </div>
          )}
          <span>{b.nome}</span>
        </button>
      ))}
    </div>
  </section>
);

export default BarbeiroSelector;
