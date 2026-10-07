import { Button } from "@/components/ui/button";

interface Props {
  onClick: () => void;
  disabled?: boolean;
  totalPreco?: number;
}

const BotaoAgendar = ({ onClick, disabled, totalPreco }: Props) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    className="w-full h-auto py-4 text-sm font-bold flex flex-col items-center gap-1"
  >
    {disabled ? "Agendando..." : "Confirmar Agendamento"}
    {totalPreco != null && totalPreco > 0 && (
      <span className="text-sm font-medium opacity-90 mt-0.5">
        Total: R${totalPreco}
      </span>
    )}
  </Button>
);

export default BotaoAgendar;
