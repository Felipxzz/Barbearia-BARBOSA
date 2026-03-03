interface Props {
  onClick: () => void;
  disabled?: boolean;
}

const BotaoAgendar = ({ onClick, disabled }: Props) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="fixed bottom-0 left-0 w-full py-6 gradient-gold text-primary-foreground text-xl font-bold tracking-wide shadow-gold transition-transform active:scale-[0.97] z-50 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {disabled ? "Agendando..." : "Confirmar Agendamento"}
  </button>
);

export default BotaoAgendar;
