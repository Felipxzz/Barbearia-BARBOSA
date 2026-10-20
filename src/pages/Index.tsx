import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import HeroSection from "@/components/HeroSection";
import { BarbosaHeader, BarbosaSections, BarbosaReviews, BarbosaGallery, BarbosaFooter } from "@/components/BarbosaPresentation";
import "@/styles/barbosa.css";
import SobreTCC from "@/components/SobreTCC";
import FormDados from "@/components/FormDados";
import ServicoSelector from "@/components/ServicoSelector";
import BarbeiroSelector from "@/components/BarbeiroSelector";
import DiaSelector from "@/components/DiaSelector";
import HorarioSelector from "@/components/HorarioSelector";
import BotaoAgendar from "@/components/BotaoAgendar";

const SERVICOS = [
  { id: "corte", nome: "Corte", preco: "R$30", valor: 30 },
  { id: "plano", nome: "Plano Mensal", preco: "R$70", valor: 70 },
  { id: "pezinho", nome: "Pezinho", preco: "R$10", valor: 10 },
  { id: "barba", nome: "Barba", preco: "R$15", valor: 15 },
  { id: "corte-barba", nome: "Corte + Barba", preco: "R$40", valor: 40 },
  { id: "pigmentacao", nome: "Pigmentação", preco: "R$15", valor: 15 },
  { id: "luzes", nome: "Luzes", preco: "R$100", valor: 100 },
  { id: "platinado", nome: "Platinado", preco: "R$120", valor: 120 },
];

const BARBEIROS = [
  { id: "kauan", nome: "Kauan" },
  { id: "ryan", nome: "Ryan" },
];

const Index = () => {
  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(fontLink);
    return () => { fontLink.remove(); };
  }, []);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [obs, setObs] = useState("");
  const [servicos, setServicos] = useState<string[]>([]);

  const toggleServico = (id: string) => {
    setServicos((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };
  const [barbeiro, setBarbeiro] = useState("");
  const [dia, setDia] = useState("");
  const [horario, setHorario] = useState("");
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const dias = useMemo(() => {
    const result = [];
    const hoje = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(hoje.getDate() + i);
      const dow = d.getDay();
      if (dow === 0 || dow === 1) continue;
      result.push(d);
      if (result.length === 7) break;
    }
    return result;
  }, []);

  // Buscar horários ocupados quando barbeiro ou dia mudar
  useEffect(() => {
    if (!barbeiro || !dia) {
      setHorariosOcupados([]);
      return;
    }
    const fetchOcupados = async () => {
      const { data } = await supabase
        .from("agendamentos")
        .select("horario")
        .eq("barbeiro", barbeiro)
        .eq("dia", dia);
      setHorariosOcupados(data?.map((a) => a.horario) ?? []);
    };
    fetchOcupados();
  }, [barbeiro, dia]);

  const handleAgendar = async () => {
    if (!nome || !telefone || servicos.length === 0 || !barbeiro || !dia || !horario) {
      toast.error("Preencha todas as informações!");
      return;
    }

    setLoading(true);

    const servicoTexto = servicos.map((id) => SERVICOS.find((s) => s.id === id)?.nome).join(", ");
    const isPlano = servicos.includes("plano");

    // Se plano mensal, agendar para todas as semanas do mês (mesmo dia da semana)
    let datasParaAgendar = [dia];
    if (isPlano) {
      const dataBase = new Date(dia + "T12:00:00");
      const diaSemana = dataBase.getDay();
      const mes = dataBase.getMonth();
      const ano = dataBase.getFullYear();
      const todasDatas: string[] = [];
      const d = new Date(ano, mes, 1);
      while (d.getMonth() === mes) {
        if (d.getDay() === diaSemana) {
          todasDatas.push(d.toISOString().split("T")[0]);
        }
        d.setDate(d.getDate() + 1);
      }
      datasParaAgendar = todasDatas;
    }

    const servicosInfo = servicos.map((id) => SERVICOS.find((s) => s.id === id)).filter(Boolean);
    const barbeiroInfo = BARBEIROS.find((b) => b.id === barbeiro);
    // Mensagem vai direto para o barbeiro escolhido (Kauan ou Ryan)
    const telefoneBarbearia = barbeiro === "ryan" ? "15991566902" : "15997451750";
    const servicosTexto = servicosInfo.map((s) => s ? `${s.nome} - ${s.preco}` : "").filter(Boolean).join(", ");
    const datasTexto = isPlano ? datasParaAgendar.join(", ") : dia;

    const mensagem = `Olá, gostaria de agendar na Barbearia Barbosa.
Nome: ${nome}
Telefone: ${telefone}
Serviço(s): ${servicosTexto}
Barbeiro: ${barbeiroInfo?.nome}
Data(s): ${datasTexto}
Horário: ${horario}
${isPlano ? "📋 PLANO MENSAL - Agendado para todas as semanas do mês\n" : ""}OBS: ${obs}`;

    // Link direto (wa.me) já preenchido, aberto no clique para o navegador não bloquear
    const urlWhats = `https://wa.me/${telefoneBarbearia}?text=${encodeURIComponent(mensagem)}`;
    const janelaWhats = window.open(urlWhats, "_blank");

    const inserts = datasParaAgendar.map((diaAgendar) => ({
      nome,
      telefone,
      servico: servicoTexto,
      barbeiro,
      dia: diaAgendar,
      horario,
      obs: isPlano ? `${obs ? obs + " | " : ""}Plano Mensal` : obs,
    }));

    const { error } = await supabase.from("agendamentos").insert(inserts);

    if (error) {
      if (error.code === "23505") {
        toast.error("Um dos horários já foi reservado! Escolha outro.");
      } else {
        toast.error("Erro ao agendar. Tente novamente.");
      }
      janelaWhats?.close();
      setLoading(false);
      return;
    }

    // Atualizar horários ocupados
    setHorariosOcupados((prev) => [...prev, horario]);

    // Se o navegador bloqueou a janela do WhatsApp, força o link direto (wa.me)
    if (!janelaWhats || janelaWhats.closed) window.location.href = urlWhats;

    toast.success("Agendamento realizado com sucesso!");
    setLoading(false);
  };

  return (
    <div className="barbosa-site min-h-screen">
      <BarbosaHeader />
      <HeroSection />
      <section id="agendamento" className="barbosa-booking">
      <div className="barbosa-container">
      <div className="barbosa-booking-layout">
      <div className="barbosa-booking-summary"><span className="barbosa-eyebrow">RESERVE SEU HORÁRIO</span><h2>SEU PRÓXIMO CORTE<br /><span className="text-primary">COMEÇA AQUI.</span></h2><p className="barbosa-copy">Barbearia Barbosa • Kauan e Ryan</p></div>
      <div className="barbosa-booking-form">
        <FormDados
          nome={nome}
          setNome={setNome}
          telefone={telefone}
          setTelefone={setTelefone}
          obs={obs}
          setObs={setObs}
        />
        <ServicoSelector
          servicos={SERVICOS}
          selected={servicos}
          onToggle={toggleServico}
        />
        <BarbeiroSelector
          barbeiros={BARBEIROS}
          selected={barbeiro}
          onSelect={setBarbeiro}
        />
        <DiaSelector dias={dias} selected={dia} onSelect={(d) => { setDia(d); setHorario(""); }} />
        {dia && (
          <HorarioSelector
            dia={dia}
            selected={horario}
            onSelect={setHorario}
            horariosOcupados={horariosOcupados}
          />
        )}
      <BotaoAgendar
        onClick={handleAgendar}
        disabled={loading}
        totalPreco={servicos.reduce((sum, id) => sum + (SERVICOS.find((s) => s.id === id)?.valor ?? 0), 0)}
      />
      </div>
      </div>
      <details className="barbosa-tcc"><summary>Sobre o projeto • Apresentação TCC</summary><SobreTCC /></details>
      </div>
      </section>
      <BarbosaSections onChooseService={(id) => setServicos([id])} />
      <BarbosaReviews />
      <BarbosaGallery />
      <BarbosaFooter />
    </div>
  );
};

export default Index;
