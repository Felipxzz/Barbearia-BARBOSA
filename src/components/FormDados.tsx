interface Props {
  nome: string;
  setNome: (v: string) => void;
  telefone: string;
  setTelefone: (v: string) => void;
  obs: string;
  setObs: (v: string) => void;
}

const FormDados = ({ nome, setNome, telefone, setTelefone, obs, setObs }: Props) => (
  <section>
    <h2 className="text-gold text-lg font-bold mb-3">Seus Dados</h2>
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Seu nome"
        value={nome}
        onChange={(e) => setNome(e.target.value.replace(/[0-9]/g, ""))}
        className="w-full p-3.5 rounded-xl border-none bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <input
        type="tel"
        inputMode="numeric"
        placeholder="Seu telefone"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value.replace(/[^0-9]/g, ""))}
        className="w-full p-3.5 rounded-xl border-none bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <textarea
        placeholder="OBS: Informações adicionais"
        value={obs}
        onChange={(e) => setObs(e.target.value)}
        className="w-full p-3.5 rounded-xl border-none bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none h-20"
      />
    </div>
  </section>
);

export default FormDados;
