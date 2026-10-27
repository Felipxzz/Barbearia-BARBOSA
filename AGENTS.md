# Architecture rules
- Keep the marketing presentation separate from the existing appointment state and submission logic so visual changes do not affect reservations.
- Apply Barbosa styling through the `.barbosa-site` wrapper class (public page and admin panel) so the two share the same colors without leaking into other pages.
- Share the persisted services/professionals catalog through useCatalog; keep static data as initial fallback to preserve existing content before first administrative save.
- Validate all administrator writes server-side in admin-agendamentos using the existing secret; never persist administrator credentials in browser storage.
- Derive customer lists from appointments without creating client accounts or public profile tables.
- Render professional photos through BarberPhoto so unavailable images show a neutral icon without removing the saved photo.
- Keep cover video decorative, muted and inline with the original photo fallback; reduced-motion shows the still photo to preserve accessibility.
- Fit cover media without cropping and let hero height grow with its content; bounded zoom must never exceed the fitted media size so narrow or short viewports retain the full image and controls.