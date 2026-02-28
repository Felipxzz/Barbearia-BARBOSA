import { useState, useMemo } from "react";
import HeroSection from "@/components/HeroSection";
import GaleriaCortes from "@/components/GaleriaCortes";
import FormDados from "@/components/FormDados";
import ServicoSelector from "@/components/ServicoSelector";
import BarbeiroSelector from "@/components/BarbeiroSelector";
import DiaSelector from "@/components/DiaSelector";
import HorarioSelector from "@/components/HorarioSelector";
import BotaoAgendar from "@/components/BotaoAgendar";

const SERVICOS = [
  { id: "corte", nome: "Corte Avulso", preco: "R$30" },
  { id: "plano", nome: "Plano Mensal", preco: "R$70" },
  { id: "pezinho", nome: "Pezinho", preco: "R$10" },
  { id: "barba", nome: "Barba", preco: "R$15" },
  { id: "corte-barba", nome: "Corte + Barba", preco: "R$40" },
];

const BARBEIROS = [
  { id: "murilo", nome: "Murilo" },
  { id: "ryan", nome: "Ryan" },
];

const Index = () => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [obs, setObs] = useState("");
  const [servico, setServico] = useState("");
  const [barbeiro, setBarbeiro] = useState("");
  const [dia, setDia] = useState("");
  const [horario, setHorario] = useState("");

  const dias = useMemo(() => {
    const result = [];
    const hoje = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(hoje.getDate() + i);
      result.push(d);
    }
    return result;
  }, []);

  const handleAgendar = () => {
    if (!nome || !telefone || !servico || !barbeiro || !dia || !horario) {
      alert("Preencha todas as informações!");
      return;
    }

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
          <HorarioSelector dia={dia} selected={horario} onSelect={setHorario} />
        )}
      </div>
      <BotaoAgendar onClick={handleAgendar} />
    </div>
  );
};

export default Index;
