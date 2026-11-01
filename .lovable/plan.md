# Ajustes mínimos no painel Barbosa

## Alterações
- No celular, dispor os oito botões em grade de duas colunas e quatro linhas, mantendo a ordem Agenda, Clientes, Financeiro, Plano mensal, Avaliações, Atividades, Serviços e Profissionais.
- Manter “Ver agendamentos” e listar todos os registros do plano do cliente no mês exibido, em ordem cronológica, com data, horário, profissional e status. Cancelados aparecem, mas não contam como usados/restantes. Aplicar as cores do painel também à janela.
- Preservar o preço configurável atual e todas as reservas. Se houver menos de quatro reservas existentes no mês, mostrar as disponíveis, sem inventar semanas ou alterar a recorrência do agendamento.
- Revisar exclusões existentes de Serviços e Profissionais. Não acrescentar exclusões a clientes derivados de reservas, financeiro ou atividades; itens de hoje sem identificação confiável serão informados sem mudanças.

## Validação
- Executar os testes disponíveis, incluindo regras de agrupamento mensal e cancelados.
- Conferir grade, janela e navegação no celular e computador. Se o acesso administrativo real não estiver disponível sem credenciais, informar a limitação e verificar a apresentação com dados controlados.

## Detalhes técnicos
- Alterações pontuais nos estilos administrativos e em PlansView; reutilizar os componentes Button e Dialog.
- Não alterar banco, funções hospedadas, fluxo público, GitHub ou Vercel. Não publicar nem fazer deploy.