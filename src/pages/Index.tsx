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
import MeusAgendamentos from "@/components/MeusAgendamentos";

import { useCatalog } from "@/hooks/use-catalog";

const Index = () => {
  const { catalog } = useCatalog();
  const SERVICOS = catalog.servicos.filter(s => s.ativo !== false);
  const BARBEIROS = catalog.barbeiros.filter(b => b.ativo !== false);
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
      const { data } = await supabase.rpc("horarios_ocupados", { _barbeiro: barbeiro, _dia: dia });
      setHorariosOcupados((data as string[] | null) ?? []);
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
    if (!barbeiroInfo || servicos.some(id => !SERVICOS.some(s => s.id === id))) {
      toast.error("Selecione novamente os serviços e o profissional disponíveis.");
      setLoading(false);
      return;
    }
    const telefoneBarbearia = barbeiroInfo.whatsapp;
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

    // Abre a janela no clique (evita bloqueio) e define o link depois de ter o código
    const janelaWhats = window.open("", "_blank");

    const inserts = datasParaAgendar.map((diaAgendar) => ({
      nome,
      telefone,
      servico: servicoTexto,
      barbeiro,
      dia: diaAgendar,
      horario,
      obs: isPlano ? `${obs ? obs + " | " : ""}Plano Mensal` : obs,
    }));

    const { data: codigo, error } = await supabase.rpc("criar_agendamentos", { _itens: inserts });

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

    setHorariosOcupados((prev) => [...prev, horario]);
    const urlWhats = `https://wa.me/${telefoneBarbearia}?text=${encodeURIComponent(`${mensagem}\nCódigo do agendamento: ${codigo}`)}`;
    if (janelaWhats && !janelaWhats.closed) janelaWhats.location.href = urlWhats;
    else window.location.href = urlWhats;

    toast.success(`Agendamento realizado! Seu código: ${codigo}`, { duration: 20000, description: "Guarde este código para consultar ou cancelar em 'Meus agendamentos'." });
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
          onSelect={(id) => { setBarbeiro(id); setHorario(""); }}
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
      <BarbosaSections onChooseService={(id) => setServicos([id])} onChooseBarber={(id) => { setBarbeiro(id); setHorario(""); }} />
      <MeusAgendamentos barbeiros={catalog.barbeiros} />
      <BarbosaReviews />
      <BarbosaGallery />
      <BarbosaFooter />
    </div>
  );
};

export default Index;
