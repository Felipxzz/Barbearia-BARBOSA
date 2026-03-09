import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import HeroSection from "@/components/HeroSection";
import GaleriaCortes from "@/components/GaleriaCortes";
import FormDados from "@/components/FormDados";
import ServicoSelector from "@/components/ServicoSelector";
import BarbeiroSelector from "@/components/BarbeiroSelector";
import DiaSelector from "@/components/DiaSelector";
import HorarioSelector from "@/components/HorarioSelector";
import BotaoAgendar from "@/components/BotaoAgendar";

const SERVICOS = [
  { id: "corte", nome: "Corte", preco: "R$30" },
  { id: "plano", nome: "Plano Mensal", preco: "R$70" },
  { id: "pezinho", nome: "Pezinho", preco: "R$10" },
  { id: "barba", nome: "Barba", preco: "R$15" },
  { id: "corte-barba", nome: "Corte + Barba", preco: "R$40" },
  { id: "pigmentacao", nome: "Pigmentação", preco: "R$15" },
  { id: "luzes", nome: "Luzes", preco: "R$100" },
  { id: "platinado", nome: "Platinado", preco: "R$120" },
];

const BARBEIROS = [
  { id: "murilo", nome: "Murilo" },
  { id: "ryan", nome: "Ryan" },
];

const Index = () => {
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
    if (!nome || !telefone || !servico || !barbeiro || !dia || !horario) {
      toast.error("Preencha todas as informações!");
      return;
    }

    setLoading(true);

    // Salvar no banco
    const { error } = await supabase.from("agendamentos").insert({
      nome,
      telefone,
      servico,
      barbeiro,
      dia,
      horario,
      obs,
    });

    if (error) {
      if (error.code === "23505") {
        toast.error("Este horário já foi reservado! Escolha outro.");
      } else {
        toast.error("Erro ao agendar. Tente novamente.");
      }
      setLoading(false);
      return;
    }

    // Atualizar horários ocupados
    setHorariosOcupados((prev) => [...prev, horario]);

    const servicoInfo = SERVICOS.find((s) => s.id === servico);
    const barbeiroInfo = BARBEIROS.find((b) => b.id === barbeiro);
    const telefoneBarbearia = barbeiro === "ryan" ? "15991566902" : "15997451750";

    const mensagem = `Olá, gostaria de agendar na Barbearia Barbosa.
Nome: ${nome}
Telefone: ${telefone}
Serviço: ${servicoInfo?.nome} - ${servicoInfo?.preco}
Barbeiro: ${barbeiroInfo?.nome}
Data: ${dia}
Horário: ${horario}
OBS: ${obs}`;

    window.open(
      `https://wa.me/${telefoneBarbearia}?text=${encodeURIComponent(mensagem)}`,
      "_blank"
    );

    toast.success("Agendamento realizado com sucesso!");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <HeroSection />
      <div className="max-w-lg mx-auto px-4 py-6 space-y-8">
        <GaleriaCortes />
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
          selected={servico}
          onSelect={setServico}
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
      </div>
      <BotaoAgendar onClick={handleAgendar} disabled={loading} />
    </div>
  );
};

export default Index;
