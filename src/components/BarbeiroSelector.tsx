import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";
import ryanImg from "@/assets/ryan.jpeg";
import kauanImg from "@/assets/kauan.jpeg.asset.json";

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
  kauan: kauanImg.url,
};

const BarbeiroSelector = ({ barbeiros, selected, onSelect }: Props) => (
  <section>
    <h2 className="text-gold text-lg font-bold mb-3">Escolha o Barbeiro</h2>
    <div className="flex flex-col gap-2.5">
      {barbeiros.map((b, i) => (
        <Button variant="ghost"
          key={b.id}
          onClick={() => onSelect(b.id)}
          style={{ animationDelay: `${i * 80}ms` }}
          className={`card-anim barbosa-option group p-4 rounded-xl text-left text-sm font-medium border flex items-center gap-3 ${
            selected === b.id
              ? "gradient-gold text-primary-foreground border-transparent font-bold card-selected"
              : "bg-card text-foreground border-gold-subtle"
          }`}
        >
          {(b.foto ?? FOTOS[b.id]) ? (
            <img src={(b.foto ?? FOTOS[b.id])} alt={b.nome} className="w-12 h-12 rounded-full object-cover transition-transform duration-300 group-hover:scale-110" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <Scissors className="w-5 h-5" />
            </div>
          )}
          <span>{b.nome}</span>
        </Button>
      ))}
    </div>
  </section>
);

export default BarbeiroSelector;
