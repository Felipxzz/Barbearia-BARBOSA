import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, Scissors, CalendarCheck } from "lucide-react";
import { SERVICOS, BARBEIROS, whatsappLink } from "@/data/barbearia";

const DIAS_SEMANA: Record<number, string> = {
  0: "dom", 1: "seg", 2: "ter", 3: "qua", 4: "qui", 5: "sexta", 6: "sáb",
};

const Passo = ({ n, titulo, children }: { n: number; titulo: string; children: React.ReactNode }) => (
  <section className="space-y-3">
    <h2 className="flex items-center gap-3 text-lg font-bold text-foreground">
      <span className="w-7 h-7 rounded-full gradient-gold text-primary-foreground text-sm flex items-center justify-center font-black shrink-0">
        {n}
      </span>
      {titulo}
    </h2>
    {children}
  </section>
);

const Agendamento = () => {
  const [params] = useSearchParams();
  const [servicos, setServicos] = useState<string[]>(() => {
    const s = params.get("servico");
    return s && SERVICOS.some((x) => x.id === s) ? [s] : [];
  });
  const [barbeiro, setBarbeiro] = useState(() => {
    const b = params.get("barbeiro");
    return b && BARBEIROS.some((x) => x.id === b) ? b : "";
  });
  const [dia, setDia] = useState("");
  const [horario, setHorario] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whats, setWhats] = useState("");
  const [obs, setObs] = useState("");
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState<null | { datas: string[]; link: string }>(null);

  const toggleServico = (id: string) =>
    setServicos((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const dias = useMemo(() => {
    const result: Date[] = [];
    const hoje = new Date();
    for (let i = 0; i < 21; i++) {
      const d = new Date();
      d.setDate(hoje.getDate() + i);
      const dow = d.getDay();
      if (dow === 0 || dow === 1) continue;
      result.push(d);
      if (result.length === 10) break;
    }
    return result;
  }, []);

  const horarios = useMemo(() => {
    if (!dia) return [];
    const diaSemana = new Date(dia + "T12:00:00").getDay();
    const inicio = diaSemana === 6 ? 8 : 14;
    const result: string[] = [];
    for (let i = inicio; i <= 19; i++) result.push((i < 10 ? "0" : "") + i + ":00");
    return result;
  }, [dia]);

  useEffect(() => {
    if (!barbeiro || !dia) {
      setHorariosOcupados([]);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("agendamentos")
        .select("horario")
        .eq("barbeiro", barbeiro)
        .eq("dia", dia);
      setHorariosOcupados(data?.map((a) => a.horario) ?? []);
    })();
  }, [barbeiro, dia]);

  const total = servicos.reduce((s, id) => s + (SERVICOS.find((x) => x.id === id)?.valor ?? 0), 0);
  const barbeiroInfo = BARBEIROS.find((b) => b.id === barbeiro);

  const handleAgendar = async () => {
    if (!nome || !telefone || servicos.length === 0 || !barbeiro || !dia || !horario) {
      toast.error("Preencha todas as informações!");
      return;
    }
    setLoading(true);

    const servicoTexto = servicos.map((id) => SERVICOS.find((s) => s.id === id)?.nome).join(", ");
    const isPlano = servicos.includes("plano");

    let datasParaAgendar = [dia];
    if (isPlano) {
      const dataBase = new Date(dia + "T12:00:00");
      const diaSemana = dataBase.getDay();
      const mes = dataBase.getMonth();
      const ano = dataBase.getFullYear();
      const todasDatas: string[] = [];
      const d = new Date(ano, mes, 1);
      while (d.getMonth() === mes) {
        if (d.getDay() === diaSemana) todasDatas.push(d.toISOString().split("T")[0]);
        d.setDate(d.getDate() + 1);
      }
      datasParaAgendar = todasDatas;
    }

    const inserts = datasParaAgendar.map((diaAgendar) => ({
      nome,
      telefone,
      servico: servicoTexto,
      barbeiro,
      dia: diaAgendar,
      horario,
      obs: [obs, whats ? `WhatsApp: ${whats}` : "", isPlano ? "Plano Mensal" : ""]
        .filter(Boolean)
        .join(" | "),
    }));

    const { error } = await supabase.from("agendamentos").insert(inserts);
    if (error) {
      toast.error(
        error.code === "23505"
          ? "Um dos horários já foi reservado! Escolha outro."
          : "Erro ao agendar. Tente novamente."
      );
      setLoading(false);
      return;
    }

    setHorariosOcupados((prev) => [...prev, horario]);

    const servicosTexto = servicos
      .map((id) => SERVICOS.find((s) => s.id === id))
      .filter(Boolean)
      .map((s) => `${s!.nome} - ${s!.preco}`)
      .join(", ");

    const mensagem = `Olá, gostaria de agendar na Barbearia Barbosa.
Nome: ${nome}
Telefone: ${telefone}${whats ? `\nWhatsApp: ${whats}` : ""}
Serviço(s): ${servicosTexto}
Barbeiro: ${barbeiroInfo?.nome}
Data(s): ${datasParaAgendar.join(", ")}
Horário: ${horario}
Valor: R$${total}
${isPlano ? "📋 PLANO MENSAL - Agendado para todas as semanas do mês\n" : ""}OBS: ${obs}`;

    const link = whatsappLink(barbeiroInfo!.whatsapp, mensagem);
    window.open(link, "_blank");
    setSucesso({ datas: datasParaAgendar, link });
    toast.success("Agendamento realizado com sucesso!");
    setLoading(false);
  };

  if (sucesso) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-20 h-20 rounded-full gradient-gold mx-auto flex items-center justify-center">
          <CalendarCheck className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-black text-gold">Agendamento confirmado!</h1>
        <p className="text-muted-foreground">
          {nome}, seu horário está reservado com {barbeiroInfo?.nome}.
        </p>
        <div className="bg-card border border-gold-subtle rounded-2xl p-5 text-left text-sm space-y-2">
          <p><span className="text-muted-foreground">Serviço:</span> <strong>{servicos.map((id) => SERVICOS.find((s) => s.id === id)?.nome).join(", ")}</strong></p>
          <p><span className="text-muted-foreground">Profissional:</span> <strong>{barbeiroInfo?.nome}</strong></p>
          <p><span className="text-muted-foreground">Data(s):</span> <strong>{sucesso.datas.join(", ")}</strong></p>
          <p><span className="text-muted-foreground">Horário:</span> <strong>{horario}</strong></p>
          <p><span className="text-muted-foreground">Valor:</span> <strong className="text-gold">R${total}</strong></p>
        </div>
        <div className="flex flex-col gap-3">
          <a href={sucesso.link} target="_blank" rel="noreferrer" className="gradient-gold text-primary-foreground font-bold py-3 rounded-xl">
            ENVIAR CONFIRMAÇÃO NO WHATSAPP
          </a>
          <Link to="/" className="border border-gold-subtle text-foreground font-medium py-3 rounded-xl">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 pb-32 space-y-9">
      <header className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-gold">Agendamento</h1>
        <p className="text-muted-foreground text-sm">Escolha o serviço, o profissional e o melhor horário.</p>
      </header>

      <Passo n={1} titulo="Escolha o serviço">
        <div className="grid sm:grid-cols-2 gap-2.5">
          {SERVICOS.map((s, i) => {
            const sel = servicos.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleServico(s.id)}
                style={{ animationDelay: `${i * 40}ms` }}
                className={`card-anim p-4 rounded-xl text-left text-sm border flex items-center gap-3 ${
                  sel
                    ? "gradient-gold text-primary-foreground border-transparent font-bold card-selected"
                    : "bg-card text-foreground border-gold-subtle"
                }`}
              >
                <span className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${sel ? "border-primary-foreground bg-primary-foreground/20" : "border-muted-foreground"}`}>
                  {sel && <Check className="w-3 h-3" />}
                </span>
                <span className="flex-1">
                  {s.nome}
                  <span className="block text-xs opacity-80">{s.preco} · {s.duracao}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Passo>

      <Passo n={2} titulo="Escolha o profissional">
        <div className="grid sm:grid-cols-2 gap-2.5">
          {BARBEIROS.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setBarbeiro(b.id)}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`card-anim p-4 rounded-xl text-left text-sm border flex items-center gap-3 ${
                barbeiro === b.id
                  ? "gradient-gold text-primary-foreground border-transparent font-bold card-selected"
                  : "bg-card text-foreground border-gold-subtle"
              }`}
            >
              {b.foto ? (
                <img src={b.foto} alt={b.nome} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <span className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Scissors className="w-5 h-5" />
                </span>
              )}
              <span>
                {b.nome}
                <span className="block text-xs opacity-80">{b.especialidade}</span>
              </span>
            </button>
          ))}
        </div>
      </Passo>

      <Passo n={3} titulo="Escolha a data">
        <div className="flex overflow-x-auto gap-2.5 pb-2 -mx-1 px-1">
          {dias.map((d, i) => {
            const dataStr = d.toISOString().split("T")[0];
            const label = `${DIAS_SEMANA[d.getDay()]}., ${d.getDate()}/${d.getMonth() + 1}`;
            return (
              <button
                key={dataStr}
                onClick={() => { setDia(dataStr); setHorario(""); }}
                style={{ animationDelay: `${i * 35}ms` }}
                className={`card-anim flex-shrink-0 px-4 py-3 rounded-xl text-sm border border-transparent ${
                  dia === dataStr ? "gradient-gold text-primary-foreground font-bold card-selected" : "bg-card text-foreground"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </Passo>

      {dia && (
        <Passo n={4} titulo="Escolha o horário">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {horarios.map((h, i) => {
              const ocupado = horariosOcupados.includes(h);
              return (
                <button
                  key={h}
                  disabled={ocupado}
                  onClick={() => setHorario(h)}
                  style={{ animationDelay: `${i * 30}ms` }}
                  className={`card-anim py-3 rounded-lg text-sm border border-transparent ${
                    ocupado
                      ? "bg-muted text-muted-foreground line-through opacity-50 cursor-not-allowed"
                      : horario === h
                      ? "gradient-gold text-primary-foreground font-bold card-selected"
                      : "bg-card text-foreground"
                  }`}
                >
                  {h}
                </button>
              );
            })}
          </div>
          {!barbeiro && <p className="text-xs text-muted-foreground">Selecione um profissional para ver a disponibilidade real.</p>}
        </Passo>
      )}

      <Passo n={5} titulo="Seus dados">
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value.replace(/[0-9]/g, ""))}
            className="w-full p-3.5 rounded-xl bg-card border border-gold-subtle text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="tel"
            inputMode="numeric"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value.replace(/[^0-9]/g, ""))}
            className="w-full p-3.5 rounded-xl bg-card border border-gold-subtle text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="tel"
            inputMode="numeric"
            placeholder="WhatsApp (se for diferente)"
            value={whats}
            onChange={(e) => setWhats(e.target.value.replace(/[^0-9]/g, ""))}
            className="w-full p-3.5 rounded-xl bg-card border border-gold-subtle text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <textarea
            placeholder="OBS: informações adicionais"
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            className="w-full p-3.5 rounded-xl bg-card border border-gold-subtle text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none h-20"
          />
        </div>
      </Passo>

      <Passo n={6} titulo="Confirmação">
        <div className="bg-card border border-gold-subtle rounded-2xl p-5 text-sm space-y-2">
          <p><span className="text-muted-foreground">Serviço:</span> {servicos.length ? servicos.map((id) => SERVICOS.find((s) => s.id === id)?.nome).join(", ") : "—"}</p>
          <p><span className="text-muted-foreground">Profissional:</span> {barbeiroInfo?.nome ?? "—"}</p>
          <p><span className="text-muted-foreground">Data:</span> {dia || "—"}</p>
          <p><span className="text-muted-foreground">Horário:</span> {horario || "—"}</p>
          <p><span className="text-muted-foreground">Valor:</span> <strong className="text-gold">R${total}</strong></p>
        </div>
      </Passo>

      <button
        onClick={handleAgendar}
        disabled={loading}
        className="fixed bottom-0 left-0 w-full py-5 gradient-gold text-primary-foreground text-lg font-bold tracking-wide shadow-gold active:scale-[0.98] transition-transform z-40 disabled:opacity-50 flex flex-col items-center"
      >
        {loading ? "Agendando..." : "CONFIRMAR AGENDAMENTO"}
        {total > 0 && <span className="text-sm font-medium opacity-90">Total: R${total}</span>}
      </button>
    </div>
  );
};

export default Agendamento;
