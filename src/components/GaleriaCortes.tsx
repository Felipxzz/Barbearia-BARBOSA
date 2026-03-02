import corte1 from "@/assets/corte1.jpeg";
import corte2 from "@/assets/corte2.jpeg";
import corte3 from "@/assets/corte3.jpeg";
import corte4 from "@/assets/corte4.jpeg";
import corte5 from "@/assets/corte5.jpeg";
import corte6 from "@/assets/corte6.jpeg";
import corte7 from "@/assets/corte7.jpeg";
import corte8 from "@/assets/corte8.jpeg";
import corte9 from "@/assets/corte9.jpeg";
import corte10 from "@/assets/corte10.jpeg";
import corte11 from "@/assets/corte11.jpeg";
import corte12 from "@/assets/corte12.jpeg";
import corte13 from "@/assets/corte13.jpeg";

const fotos = [corte1, corte2, corte3, corte4, corte5, corte6, corte7, corte8, corte9, corte10, corte11, corte12, corte13];

const GaleriaCortes = () => (
  <section>
    <h2 className="text-gold text-lg font-bold mb-3">Cortes Recentes</h2>
    <div className="grid grid-cols-2 gap-3">
      {fotos.map((foto, i) => (
        <img
          key={i}
          src={foto}
          alt={`Corte ${i + 1}`}
          className="w-full h-36 object-cover rounded-xl hover:scale-105 transition-transform duration-300 border border-gold-subtle"
          loading="lazy"
        />
      ))}
    </div>
  </section>
);

export default GaleriaCortes;
