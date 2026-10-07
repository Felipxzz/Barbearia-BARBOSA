import heroBg from "@/assets/hero-bg.jpeg";
import { ArrowUpRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => (
  <section id="inicio" className="barbosa-hero">
    <img src={heroBg} alt="Barbearia Barbosa" className="barbosa-hero-image" />
    <div className="barbosa-hero-shade" />
    <div className="barbosa-container relative z-10 w-full">
      <span className="barbosa-hero-badge"><Star /> ESTILO E TRADIÇÃO</span>
      <h1>BARBEARIA BARBOSA.<br />SEU CORTE,<br /><span className="text-primary">SUA IDENTIDADE.</span></h1>
      <p>O estilo é levado a sério e o resultado é sempre de respeito. Vem ficar na régua com a gente.</p>
      <Button asChild className="barbosa-cta"><a href="#planos">CONHECER O PLANO MENSAL <ArrowUpRight /></a></Button>
    </div>
  </section>
);

export default HeroSection;
