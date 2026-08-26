import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Scissors } from "lucide-react";

const LINKS = [
  { to: "/", label: "Início" },
  { to: "/servicos", label: "Serviços" },
  { to: "/profissionais", label: "Profissionais" },
  { to: "/agendamento", label: "Agendamento" },
  { to: "/trabalhos", label: "Trabalhos" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-gold-subtle bg-background/90 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <span className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center">
            <Scissors className="w-4 h-4 text-primary-foreground" />
          </span>
          <span className="font-black tracking-tight text-gold leading-none text-sm sm:text-base">
            BARBEARIA
            <span className="block text-foreground text-[10px] tracking-[0.3em]">BARBOSA</span>
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-1">
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? "text-gold" : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            to="/agendamento"
            className="hidden sm:inline-flex gradient-gold text-primary-foreground text-xs font-bold px-4 py-2.5 rounded-xl shadow-gold hover:opacity-90 transition-opacity tracking-wide"
          >
            AGENDAR AGORA
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
            className="lg:hidden p-2 rounded-lg border border-gold-subtle text-gold"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-gold-subtle bg-background px-4 py-3 space-y-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-3 rounded-lg text-sm font-medium ${
                  isActive ? "bg-card text-gold" : "text-muted-foreground"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/agendamento"
            onClick={() => setOpen(false)}
            className="block text-center gradient-gold text-primary-foreground font-bold py-3 rounded-xl mt-2"
          >
            AGENDAR AGORA
          </Link>
        </div>
      )}

      {location.pathname !== "/agendamento" && (
        <Link
          to="/agendamento"
          className="sm:hidden fixed bottom-4 right-4 z-50 gradient-gold text-primary-foreground font-bold px-5 py-3.5 rounded-full shadow-gold text-sm"
        >
          AGENDAR
        </Link>
      )}
    </header>
  );
};

export default Navbar;
