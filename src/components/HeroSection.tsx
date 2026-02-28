const HeroSection = () => (
  <div className="relative h-48 flex items-center justify-center flex-col text-center overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />
    <div className="relative z-10">
      <h1 className="text-3xl font-black text-gold tracking-tight">💈 Barbearia Barbosa</h1>
      <p className="text-muted-foreground mt-1">Seu estilo começa aqui</p>
    </div>
  </div>
);

export default HeroSection;
