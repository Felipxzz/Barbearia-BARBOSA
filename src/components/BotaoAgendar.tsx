interface Props {
  onClick: () => void;
}

const BotaoAgendar = ({ onClick }: Props) => (
  <button
    onClick={onClick}
    className="fixed bottom-0 left-0 w-full py-6 gradient-gold text-primary-foreground text-xl font-bold tracking-wide shadow-gold transition-transform active:scale-[0.97] z-50"
  >
    Confirmar Agendamento
  </button>
);

export default BotaoAgendar;
