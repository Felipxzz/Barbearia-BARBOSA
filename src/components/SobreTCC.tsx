const AUTORES = [
  { inicial: "F", nome: "Felipe", cor: "from-amber-400 to-yellow-600" },
  { inicial: "B", nome: "Brayan", cor: "from-yellow-500 to-amber-700" },
  { inicial: "M", nome: "Miguel", cor: "from-amber-300 to-yellow-500" },
];

const SobreTCC = () => (
  <section className="bg-card rounded-2xl p-6 space-y-5 border border-gold/20 mt-8">
    <header className="text-center space-y-1">
      <span className="inline-block text-[10px] font-bold tracking-widest text-gold uppercase bg-gold/10 px-3 py-1 rounded-full">
        Trabalho de Conclusão de Curso
      </span>
      <h2 className="text-gold text-xl font-bold">Sobre o Projeto</h2>
    </header>

    <div className="space-y-2">
      <h3 className="text-foreground font-bold text-sm">📌 Resumo e Objetivo</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        O <strong className="text-foreground">Sistema de Agendamento da Barbearia Barbosa</strong> é
        uma aplicação web desenvolvida para digitalizar e otimizar o processo de marcação de horários.
        O objetivo é eliminar conflitos de agenda, reduzir o trabalho manual do barbeiro e oferecer ao
        cliente uma experiência rápida, intuitiva e disponível 24 horas por dia.
      </p>
    </div>

    <div className="space-y-2">
      <h3 className="text-foreground font-bold text-sm">⚙️ Funcionalidades Principais</h3>
      <ul className="text-muted-foreground text-sm leading-relaxed space-y-1 list-disc list-inside">
        <li>Agendamento online com seleção de múltiplos serviços</li>
        <li>Cálculo automático do valor total da reserva</li>
        <li>Escolha de barbeiro, data e horário disponível em tempo real</li>
        <li><strong className="text-foreground">Plano Mensal</strong> com agendamento automático para todas as semanas do mês</li>
        <li>Confirmação direta via integração com WhatsApp</li>
        <li>Painel administrativo protegido por senha (<code className="text-gold">/admin</code>)</li>
      </ul>
    </div>

    <div className="space-y-2">
      <h3 className="text-foreground font-bold text-sm">💻 Tecnologias Utilizadas</h3>
      <div className="flex flex-wrap gap-2">
        {["React", "TypeScript", "Vite", "Tailwind CSS", "Supabase", "Lovable Cloud", "PostgreSQL", "Edge Functions"].map((t) => (
          <span key={t} className="text-[11px] font-medium text-gold bg-gold/10 px-2.5 py-1 rounded-full">
            {t}
          </span>
        ))}
      </div>
      <p className="text-muted-foreground text-xs leading-relaxed pt-1">
        Frontend em React + TypeScript estilizado com Tailwind CSS. Backend no Lovable Cloud
        (Supabase/PostgreSQL) com Edge Functions garantindo segurança das operações administrativas.
      </p>
    </div>

    <div className="space-y-2">
      <h3 className="text-foreground font-bold text-sm">🎯 Conclusão e Aprendizados</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        O projeto demonstrou como a tecnologia transforma um pequeno negócio, substituindo anotações
        em papel por uma plataforma profissional. Aprendemos sobre desenvolvimento full-stack,
        modelagem de banco de dados, controle de concorrência, autenticação segura e integração com
        APIs externas como o WhatsApp.
      </p>
    </div>

    {/* Autoria - Avatares */}
    <div className="pt-4 border-t border-gold/20 space-y-3">
      <p className="text-center text-[10px] font-bold tracking-widest text-gold/70 uppercase">
        Desenvolvido por
      </p>
      <div className="flex justify-center gap-6">
        {AUTORES.map((a) => (
          <div key={a.nome} className="flex flex-col items-center gap-2">
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${a.cor} flex items-center justify-center text-background font-black text-xl shadow-lg ring-2 ring-gold/30`}>
              {a.inicial}
            </div>
            <span className="text-xs font-semibold text-foreground">{a.nome}</span>
          </div>
        ))}
      </div>
      <div className="text-center pt-2">
        <a
          href="/sobre-tcc.pdf"
          download
          className="inline-flex items-center gap-2 text-xs font-medium text-gold hover:text-gold/80 underline underline-offset-4"
        >
          📄 Baixar apresentação em PDF
        </a>
      </div>
    </div>
  </section>
);

export default SobreTCC;
