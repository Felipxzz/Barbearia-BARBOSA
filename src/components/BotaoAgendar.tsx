interface Props {
  onClick: () => void;
  disabled?: boolean;
  totalPreco?: number;
}

const BotaoAgendar = ({ onClick, disabled, totalPreco }: Props) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="fixed bottom-0 left-0 w-full py-5 gradient-gold text-primary-foreground text-xl font-bold tracking-wide shadow-gold transition-transform active:scale-[0.97] z-50 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center"
  >
    {disabled ? "Agendando..." : "Confirmar Agendamento"}
    {totalPreco != null && totalPreco > 0 && (
      <span className="text-sm font-medium opacity-90 mt-0.5">
        Total: R${totalPreco}
      </span>
    )}
  </button>
);

export default BotaoAgendar;
