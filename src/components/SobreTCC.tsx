const SobreTCC = () => (
  <section className="bg-card rounded-2xl p-6 space-y-5 border border-gold/20">
    <header className="text-center space-y-1">
      <span className="inline-block text-[10px] font-bold tracking-widest text-gold uppercase bg-gold/10 px-3 py-1 rounded-full">
        Trabalho de Conclusão de Curso
      </span>
      <h2 className="text-gold text-xl font-bold">Sobre o Projeto</h2>
      <p className="text-muted-foreground text-xs">Felipe, Brayan e Miguel</p>
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
        <li>Painel administrativo protegido por senha (<code className="text-gold">/admin</code>) para gerenciar e cancelar agendamentos</li>
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
        Frontend construído com React + TypeScript e estilizado com Tailwind CSS. O backend utiliza o
        Lovable Cloud (baseado em Supabase/PostgreSQL) para persistência de dados, com Edge Functions
        garantindo a segurança das operações administrativas.
      </p>
    </div>

    <div className="space-y-2">
      <h3 className="text-foreground font-bold text-sm">🎯 Conclusão e Aprendizados</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        O projeto demonstrou na prática como a tecnologia pode transformar um pequeno negócio,
        substituindo agendamentos por anotações em papel por uma plataforma profissional. Aprendemos
        sobre desenvolvimento full-stack, modelagem de banco de dados, controle de concorrência (para
        evitar dois clientes no mesmo horário), autenticação segura e integração com APIs externas
        como o WhatsApp. O resultado é uma solução real, funcional e pronta para uso.
      </p>
    </div>
  </section>
);

export default SobreTCC;
