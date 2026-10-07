import { useState } from "react";
import { ArrowUpRight, Check, Clock, MapPin, Menu, MessageCircle, Scissors, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BARBEIROS, CONTATO, SERVICOS, TRABALHOS, whatsappLink } from "@/data/barbearia";

const links = [ ["#planos", "Planos"], ["#servicos", "Serviços"], ["#sobre", "Sobre"], ["#profissionais", "Profissionais"], ["#trabalhos", "Trabalhos"], ["#contato", "Contato"] ];

export const BarbosaHeader = () => {
  const [open, setOpen] = useState(false);
  return <header className="barbosa-header">
    <nav className="barbosa-container flex items-center justify-between gap-4" aria-label="Menu principal">
      <a href="#inicio" className="barbosa-wordmark" aria-label="Barbearia Barbosa, início"><span>BARBOSA</span><small>BARBEARIA</small></a>
      <div className="hidden lg:flex items-center gap-5">{links.map(([href, label]) => <a key={href} href={href} className="barbosa-nav-link">{label}</a>)}</div>
      <div className="flex items-center gap-2"><Button asChild className="barbosa-header-cta"><a href="#agendamento">AGENDAR HORÁRIO</a></Button><Button variant="ghost" size="icon" className="lg:hidden" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button></div>
    </nav>
    {open && <div className="barbosa-mobile-menu lg:hidden">{links.map(([href, label]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}</div>}
  </header>;
};

export const BarbosaSections = ({ onChooseService }: { onChooseService: (id: string) => void }) => {
  const book = (id: string) => { onChooseService(id); document.getElementById("agendamento")?.scrollIntoView({ behavior: "smooth" }); };
  return <>
    <section id="planos" className="barbosa-section">
      <div className="barbosa-container barbosa-plan-layout">
        <div><span className="barbosa-eyebrow">SEU ESTILO, SEMPRE EM DIA</span><h2>SEU CORTE.<br />SUA ROTINA.<br /><span className="text-primary">SEU PLANO.</span></h2><p className="barbosa-copy">O cuidado com o seu visual não precisa esperar. Mantenha o corte em dia com o Plano Mensal da Barbearia Barbosa.</p></div>
        <article className="barbosa-plan"><span className="barbosa-eyebrow">BARBOSA • PLANO MENSAL</span><h3>CORTE TODA SEMANA</h3><p className="barbosa-price">R$70<span>/ mês</span></p><ul><li><Check />Corte semanal durante o mês</li><li><Check />Mesmo dia e horário</li><li><Check />Escolha o seu barbeiro</li></ul><Button className="w-full barbosa-cta" onClick={() => book("plano")}>QUERO MEU PLANO <ArrowUpRight /></Button></article>
      </div>
    </section>
    <section id="contato" className="barbosa-section barbosa-light">
      <div className="barbosa-container"><span className="barbosa-eyebrow">ENCONTRE A BARBOSA</span><h2>SEU PRÓXIMO CORTE<br />TEM ENDEREÇO.</h2><div className="barbosa-location"><div><MapPin className="text-primary" /><h3>BARBEARIA BARBOSA</h3><p>{CONTATO.endereco}</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTATO.mapsQuery)}`} target="_blank" rel="noopener noreferrer" className="barbosa-text-link">VER NO MAPA <ArrowUpRight /></a></div><div><Clock className="text-primary" /><h3>HORÁRIOS</h3>{CONTATO.horarios.map(h => <p key={h.dia}>{h.dia}<strong>{h.hora}</strong></p>)}</div><div><MessageCircle className="text-primary" /><h3>FALE COM A GENTE</h3><p>{CONTATO.telefone}</p><Button asChild className="barbosa-cta"><a href={whatsappLink(CONTATO.whatsappPrincipal, "Olá! Gostaria de agendar na Barbearia Barbosa.")} target="_blank" rel="noopener noreferrer">CHAMAR NO WHATSAPP <ArrowUpRight /></a></Button></div></div></div>
    </section>
    <section id="trabalhos" className="barbosa-section"><div className="barbosa-container"><div className="barbosa-section-heading"><div><span className="barbosa-eyebrow">FEITO NA BARBOSA</span><h2>O RESULTADO<br /><span className="text-primary">FALA POR SI.</span></h2></div><p className="barbosa-copy">Cortes, acabamentos e transformações realizados pela nossa equipe.</p></div><div className="barbosa-gallery">{TRABALHOS.map((t, i) => <a href={t.src} target="_blank" rel="noopener noreferrer" key={t.src} aria-label={`Ver foto do trabalho ${i + 1}`}><img src={t.src} alt={`Trabalho da Barbearia Barbosa ${i + 1}`} loading="lazy" /></a>)}</div></div></section>
    <section id="sobre" className="barbosa-section barbosa-about"><div className="barbosa-container barbosa-about-layout"><img src={TRABALHOS[0]?.src} alt="Corte realizado na Barbearia Barbosa" loading="lazy" /><div><span className="barbosa-eyebrow">ESTILO E CUIDADO EM CADA DETALHE</span><h2>BARBEARIA<br /><span className="text-primary">BARBOSA.</span></h2><p className="barbosa-copy">Seu corte, sua identidade. Aqui o estilo é levado a sério e o resultado é sempre de respeito.</p><p className="barbosa-copy">Do corte ao acabamento, escolha o serviço e o profissional que combinam com você.</p><Button asChild className="barbosa-cta"><a href="#agendamento">AGENDAR MEU HORÁRIO <ArrowUpRight /></a></Button></div></div></section>
    <section id="servicos" className="barbosa-section"><div className="barbosa-container"><span className="barbosa-eyebrow">CUIDADO COMPLETO</span><h2>MAIS ESTILO.<br /><span className="text-primary">DO SEU JEITO.</span></h2><div className="barbosa-services">{SERVICOS.filter(s => s.id !== "plano").map(s => <article key={s.id}><Scissors className="text-primary" /><div className="flex items-start justify-between gap-4"><h3>{s.nome}</h3><strong className="text-primary whitespace-nowrap">{s.preco}</strong></div><p>{s.descricao}</p><Button variant="link" onClick={() => book(s.id)} className="p-0 self-start">AGENDAR <ArrowUpRight /></Button></article>)}</div></div></section>
    <section id="profissionais" className="barbosa-section barbosa-light"><div className="barbosa-container"><span className="barbosa-eyebrow">QUEM CUIDA DO SEU ESTILO</span><h2>NOSSOS PROFISSIONAIS.</h2><div className="barbosa-team">{BARBEIROS.map(b => <article key={b.id}>{b.foto ? <img src={b.foto} alt={b.nome} loading="lazy" /> : <div className="barbosa-team-placeholder"><Scissors /></div>}<div><h3>{b.nome}</h3><p className="text-primary font-semibold">{b.especialidade}</p><p>{b.descricao}</p><Button asChild variant="link" className="p-0"><a href="#agendamento">AGENDAR HORÁRIO <ArrowUpRight /></a></Button></div></article>)}</div></div></section>
  </>;
};

export const BarbosaFooter = () => <>
  <footer className="barbosa-footer"><div className="barbosa-container barbosa-footer-grid"><div><a href="#inicio" className="barbosa-wordmark"><span>BARBOSA</span><small>BARBEARIA</small></a><p>Seu corte, sua identidade.</p></div><div><h3>NAVEGAÇÃO</h3>{links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}</div><div><h3>ATENDIMENTO</h3><p>{CONTATO.endereco}</p><p>{CONTATO.telefone}</p>{CONTATO.horarios.map(h => <p key={h.dia}>{h.dia}: {h.hora}</p>)}</div><div><h3>SEU HORÁRIO</h3><Button asChild className="barbosa-cta"><a href="#agendamento">AGENDAR AGORA <ArrowUpRight /></a></Button><a href="/admin">Portal do administrador</a></div></div><div className="barbosa-container barbosa-copyright">© {new Date().getFullYear()} Barbearia Barbosa. Todos os direitos reservados.</div></footer>
  <Button asChild size="icon" className="barbosa-whatsapp" aria-label="Conversar com a Barbearia Barbosa no WhatsApp"><a href={whatsappLink(CONTATO.whatsappPrincipal, "Olá! Gostaria de agendar na Barbearia Barbosa.")} target="_blank" rel="noopener noreferrer"><MessageCircle /></a></Button>
</>;