import heroBg from "@/assets/hero-bg.jpeg";
import heroVideo from "@/assets/videos/barbosa-cover-muted.mp4.asset.json";
import heroWebm from "@/assets/videos/barbosa-cover-muted.webm.asset.json";
import { ArrowUpRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => (
  <section id="inicio" className="barbosa-hero">
    <img src={heroBg} alt="Barbearia Barbosa" className="barbosa-hero-image" />
    <video className="barbosa-hero-video" autoPlay loop muted playsInline preload="metadata" poster={heroBg} aria-hidden="true">
      <source src={heroWebm.url} type="video/webm" />
      <source src={heroVideo.url} type="video/mp4" />
    </video>
    <div className="barbosa-hero-shade" />
    <div className="barbosa-container relative z-10">
      <span className="barbosa-hero-badge"><Star /> ESTILO E TRADIÇÃO</span>
      <h1>BARBEARIA BARBOSA.<br />SEU CORTE,<br /><span className="text-primary">SUA IDENTIDADE.</span></h1>
      <p>O estilo é levado a sério e o resultado é sempre de respeito. Vem ficar na régua com a gente.</p>
      <Button asChild className="barbosa-cta"><a href="#planos">CONHECER O PLANO MENSAL <ArrowUpRight /></a></Button>
    </div>
  </section>
);

export default HeroSection;
