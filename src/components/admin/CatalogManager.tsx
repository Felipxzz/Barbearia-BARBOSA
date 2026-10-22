import { useEffect, useState } from "react";
import { Plus, Save, Pencil, Scissors, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { type Catalog, type CatalogBarber, type CatalogService } from "@/hooks/use-catalog";

interface Props { catalog: Catalog; kind: "servicos" | "barbeiros"; save: (catalog: Catalog) => Promise<boolean>; busy: boolean }
export default function CatalogManager({ catalog, kind, save, busy }: Props) {
  const [draft, setDraft] = useState(catalog);
  const [selected, setSelected] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { setDraft(catalog); setDirty(false); }, [catalog]);
  const services = kind === "servicos";
  const items = services ? draft.servicos : draft.barbeiros;
  const item = items.find(i => i.id === selected);
  const update = (changes: Partial<CatalogService> | Partial<CatalogBarber>) => {
    setDraft(prev => services
      ? { ...prev, servicos: prev.servicos.map(s => s.id === selected ? { ...s, ...changes } as CatalogService : s) }
      : { ...prev, barbeiros: prev.barbeiros.map(b => b.id === selected ? { ...b, ...changes } as CatalogBarber : b) });
    setDirty(true);
  };
  const add = () => {
    const id = `${services ? "servico" : "profissional"}-${Date.now()}`;
    setDraft(prev => services ? { ...prev, servicos: [...prev.servicos, { id, nome: "Novo serviço", valor: 0, preco: "R$0", duracao: "30 min", categoria: "outros", descricao: "", ativo: true }] }
      : { ...prev, barbeiros: [...prev.barbeiros, { id, nome: "Novo profissional", especialidade: "", descricao: "", whatsapp: "", servicos: [], ativo: true }] });
    setSelected(id); setDirty(true);
  };
  const saveDraft = async () => {
    const normalized = { ...draft, servicos: draft.servicos.map(s => ({ ...s, preco: `R$${s.valor.toLocaleString("pt-BR")}` })) };
    if (await save(normalized)) { setDirty(false); setSelected(null); }
  };
  return <>
    <div className="admin-section-title"><div><h2>{services ? "Serviços" : "Profissionais"}</h2><p className="text-sm text-muted-foreground">{items.filter(i => i.ativo !== false).length} {services ? "serviços disponíveis" : "profissionais disponíveis"}</p></div><div className="flex gap-2 flex-wrap"><Button variant="outline" onClick={add}><Plus />{services ? "Novo serviço" : "Novo profissional"}</Button><Button onClick={saveDraft} disabled={busy || !dirty}><Save />{busy ? "Salvando…" : "Salvar alterações"}</Button></div></div>
    <div className="admin-catalog-grid">{items.map(entry => <article key={entry.id} className="admin-catalog-item barbosa-card card-anim">
      <div className="flex items-start justify-between gap-4"><div className="admin-item-icon">{services ? <Scissors /> : <Users />}</div><span className={`admin-status ${entry.ativo === false ? "text-muted-foreground" : "text-primary"}`}>{entry.ativo === false ? "Inativo" : "Ativo"}</span></div>
      <h3 className="mt-5">{entry.nome}</h3>
      {services ? <><strong className="text-primary">{(entry as CatalogService).preco}</strong><span className="ml-3 text-xs text-muted-foreground">{(entry as CatalogService).duracao}</span></> : <p className="text-sm text-muted-foreground">{(entry as CatalogBarber).especialidade}</p>}
      <p className="text-xs text-muted-foreground mt-3 min-h-10">{entry.descricao}</p>
      <Button variant="outline" className="w-full mt-5" onClick={() => setSelected(entry.id)}><Pencil />Editar {services ? "serviço" : "profissional"}</Button>
    </article>)}</div>
    <Dialog open={!!item} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent className="barbosa-site barbosa-admin admin-dialog"><DialogHeader><DialogTitle>Editar {services ? "serviço" : "profissional"}</DialogTitle><DialogDescription>{item?.nome}</DialogDescription></DialogHeader>{item && <div className="admin-form">
      <label>Nome<input value={item.nome} onChange={e => update({ nome: e.target.value })} /></label>
      {services ? <div className="grid grid-cols-2 gap-3"><label>Preço (R$)<input type="number" min="0" step="0.01" value={(item as CatalogService).valor} onChange={e => update({ valor: Number(e.target.value), preco: `R$${Number(e.target.value).toLocaleString("pt-BR")}` })} /></label><label>Duração<input value={(item as CatalogService).duracao} onChange={e => update({ duracao: e.target.value })} /></label><label className="col-span-2">Categoria<select value={(item as CatalogService).categoria} onChange={e => update({ categoria: e.target.value as CatalogService["categoria"] })}><option value="cortes">Cortes</option><option value="barba">Barba</option><option value="combos">Combos</option><option value="outros">Outros</option></select></label></div>
        : <><label>WhatsApp (DDD + número)<input inputMode="numeric" value={(item as CatalogBarber).whatsapp} onChange={e => update({ whatsapp: e.target.value.replace(/\D/g, "") })} /></label><label>Especialidade<input value={(item as CatalogBarber).especialidade} onChange={e => update({ especialidade: e.target.value })} /></label></>}
      <label>Descrição<textarea rows={3} value={item.descricao} onChange={e => update({ descricao: e.target.value })} /></label>
      <label className="flex items-center gap-3"><input type="checkbox" checked={item.ativo !== false} onChange={e => update({ ativo: e.target.checked })} />Disponível para agendamento</label>
      <div className="flex gap-2 justify-end"><Button variant="outline" onClick={() => setSelected(null)}><X />Fechar</Button><Button onClick={saveDraft} disabled={busy}><Save />{busy ? "Salvando…" : "Salvar alterações"}</Button></div>
    </div>}</DialogContent></Dialog>
  </>;
}