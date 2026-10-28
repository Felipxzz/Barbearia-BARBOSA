import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Search, XCircle } from "lucide-react";

type Item = { id: string; servico: string; barbeiro: string; dia: string; horario: string; status: string };

const formatDia = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" });
const passou = (dia: string, horario: string) => new Date(`${dia}T${horario}:00`) <= new Date();

const MeusAgendamentos = ({ barbeiros }: { barbeiros: { id: string; nome: string }[] }) => {
  const [telefone, setTelefone] = useState("");
  const [codigo, setCodigo] = useState("");
  const [itens, setItens] = useState<Item[] | null>(null);
  const [busy, setBusy] = useState(false);

  const buscar = async () => {
    if (telefone.length < 10 || codigo.length !== 6) { toast.error("Informe o telefone e o código de 6 dígitos."); return; }
    setBusy(true);
    const { data, error } = await supabase.rpc("consultar_agendamentos", { _telefone: telefone, _codigo: codigo });
    setBusy(false);
    if (error) { toast.error("Não foi possível consultar agora."); return; }
    setItens((data as Item[]) ?? []);
    if (!data?.length) toast.error("Nenhum agendamento encontrado com esses dados.");
  };

  const cancelar = async (id: string) => {
    if (!confirm("Deseja cancelar este agendamento?")) return;
    const { data, error } = await supabase.rpc("cancelar_agendamento", { _id: id, _telefone: telefone, _codigo: codigo });
    if (error || !data) { toast.error("Não foi possível cancelar."); return; }
    toast.success("Agendamento cancelado. O horário foi liberado.");
    setItens(prev => prev?.map(i => i.id === id ? { ...i, status: "cancelado" } : i) ?? null);
  };

  const nomeBarbeiro = (id: string) => barbeiros.find(b => b.id === id)?.nome ?? id;

  return (
    <section id="meus-agendamentos" className="barbosa-section">
      <div className="barbosa-container">
        <span className="barbosa-eyebrow">MEUS AGENDAMENTOS</span>
        <h2 className="mt-2">CONSULTE SEU <span className="text-primary">HORÁRIO.</span></h2>
        <p className="barbosa-copy mt-2">Use o telefone e o código de 6 dígitos recebido ao agendar.</p>
        <div className="barbosa-card mt-6 grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-end">
          <label className="text-sm">Telefone
            <input aria-label="Telefone" inputMode="numeric" maxLength={13} value={telefone} onChange={e => setTelefone(e.target.value.replace(/\D/g, ""))} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2" placeholder="15999999999" />
          </label>
          <label className="text-sm">Código
            <input aria-label="Código" inputMode="numeric" maxLength={6} value={codigo} onChange={e => setCodigo(e.target.value.replace(/\D/g, ""))} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2" placeholder="000000" />
          </label>
          <Button onClick={buscar} disabled={busy}><Search />{busy ? "Buscando…" : "Consultar"}</Button>
        </div>
        {itens && itens.length > 0 && (
          <div className="barbosa-services mt-6">
            {itens.map(i => {
              const cancelado = i.status === "cancelado";
              const passado = passou(i.dia, i.horario);
              return (
                <article key={i.id} className="barbosa-card card-anim">
                  <div className="flex items-center justify-between gap-2">
                    <CalendarCheck className="text-primary" />
                    <span className={`text-xs font-bold uppercase ${cancelado ? "text-destructive" : "text-primary"}`}>{cancelado ? "Cancelado" : passado ? "Concluído" : "Confirmado"}</span>
                  </div>
                  <h3 className="mt-3 capitalize">{formatDia(i.dia)} · {i.horario}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{i.servico}</p>
                  <p className="text-sm text-muted-foreground">com {nomeBarbeiro(i.barbeiro)}</p>
                  {!cancelado && !passado && <Button variant="outline" className="w-full mt-4" onClick={() => cancelar(i.id)}><XCircle />Cancelar agendamento</Button>}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MeusAgendamentos;
