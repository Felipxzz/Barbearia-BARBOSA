# Architecture rules
- Keep the marketing presentation separate from the existing appointment state and submission logic so visual changes do not affect reservations.
- Apply Barbosa styling through the `.barbosa-site` wrapper class (public page and admin panel) so the two share the same colors without leaking into other pages.