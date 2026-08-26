import { Link } from "react-router-dom";
import { MapPin, Phone, Clock } from "lucide-react";
import { CONTATO } from "@/data/barbearia";

const Footer = () => (
  <footer className="border-t border-gold-subtle bg-card/40 mt-16">
    <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-3">
      <div className="space-y-2">
        <h3 className="text-gold font-bold text-lg">Barbearia Barbosa</h3>
        <p className="text-muted-foreground text-sm">Seu estilo começa aqui.</p>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground">
        <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gold" />{CONTATO.endereco}</p>
        <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gold" />{CONTATO.telefone}</p>
        <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-gold" />Ter a Sáb</p>
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <Link to="/servicos" className="text-muted-foreground hover:text-gold">Serviços</Link>
        <Link to="/agendamento" className="text-muted-foreground hover:text-gold">Agendamento</Link>
        <Link to="/trabalhos" className="text-muted-foreground hover:text-gold">Trabalhos</Link>
        <Link to="/contato" className="text-muted-foreground hover:text-gold">Contato</Link>
      </div>
    </div>
    <p className="text-center text-xs text-muted-foreground pb-6">
      © {new Date().getFullYear()} Barbearia Barbosa
    </p>
  </footer>
);

export default Footer;
