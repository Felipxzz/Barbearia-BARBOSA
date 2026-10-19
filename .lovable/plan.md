# Reordenar a página inicial

Objetivo: o agendamento aparece logo após o topo, e as fotos dos trabalhos ficam por último (antes do rodapé).

## Nova ordem da página
1. Topo (banner principal)
2. Agendamento (formulário de reserva)
3. Plano Mensal
4. Serviços
5. Profissionais
6. Sobre
7. Contato / localização
8. Trabalhos (fotos) — por último
9. Rodapé

O menu também segue essa ordem: Agendar, Planos, Serviços, Profissionais, Sobre, Contato, Trabalhos.

## Detalhes técnicos
- `src/components/BarbosaPresentation.tsx`: dividir `BarbosaSections` em duas partes (seções antes e depois do agendamento) ou exportar `BarbosaGallery` separado; reordenar seções e o array `links`.
- `src/pages/Index.tsx`: renderizar o bloco `#agendamento` logo após `HeroSection`, depois as seções, e a galeria antes do `BarbosaFooter`.
- Lógica de agendamento, dados e envio não mudam.
