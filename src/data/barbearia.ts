
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

// Fotos dos barbeiros hospedadas em public/images
const ryanImg = "/images/IMG_9236.jpeg";
const kauanImg = "/images/IMG_9237.jpeg";

export type Categoria = "cortes" | "barba" | "combos" | "outros";

export interface Servico {
  id: string;
  nome: string;
  preco: string;
  valor: number;
  duracao: string;
  categoria: Categoria;
  descricao: string;
  destaque?: boolean;
}

export const SERVICOS: Servico[] = [
  {
    id: "corte",
    nome: "Corte",
    preco: "R$30",
    valor: 30,
    duracao: "40 min",
    categoria: "cortes",
    descricao: "Corte masculino personalizado, com acabamento na navalha e finalização.",
    destaque: true,
  },
  {
    id: "corte-barba",
    nome: "Corte + Barba",
    preco: "R$40",
    valor: 40,
    duracao: "1h",
    categoria: "combos",
    descricao: "Combo completo: corte masculino e barba desenhada com toalha quente.",
    destaque: true,
  },
  {
    id: "barba",
    nome: "Barba",
    preco: "R$15",
    valor: 15,
    duracao: "25 min",
    categoria: "barba",
    descricao: "Barba modelada e alinhada, com navalha e produtos profissionais.",
    destaque: true,
  },
  {
    id: "plano",
    nome: "Plano Mensal",
    preco: "R$70",
    valor: 70,
    duracao: "Mensal",
    categoria: "combos",
    descricao: "Corte toda semana no mesmo dia e horário durante o mês inteiro.",
    destaque: true,
  },
  {
    id: "pezinho",
    nome: "Pezinho",
    preco: "R$10",
    valor: 10,
    duracao: "15 min",
    categoria: "cortes",
    descricao: "Acabamento rápido na nuca e nas costeletas para manter o corte alinhado.",
  },
  {
    id: "pigmentacao",
    nome: "Pigmentação",
    preco: "R$15",
    valor: 15,
    duracao: "20 min",
    categoria: "outros",
    descricao: "Preenchimento e correção de falhas no cabelo ou na barba.",
  },
  {
    id: "luzes",
    nome: "Luzes",
    preco: "R$100",
    valor: 100,
    duracao: "1h30",
    categoria: "outros",
    descricao: "Mechas descoloridas feitas com técnica e produtos de qualidade.",
  },
  {
    id: "platinado",
    nome: "Platinado",
    preco: "R$120",
    valor: 120,
    duracao: "2h",
    categoria: "outros",
    descricao: "Descoloração global com matização para o tom platinado.",
  },
];

export const CATEGORIAS: {
  id: Categoria | "todos";
  label: string;
}[] = [
  { id: "todos", label: "Todos" },
  { id: "cortes", label: "Cortes" },
  { id: "barba", label: "Barba" },
  { id: "combos", label: "Combos" },
  { id: "outros", label: "Outros" },
];

export interface Barbeiro {
  id: string;
  nome: string;
  foto?: string;
  especialidade: string;
  descricao: string;
  servicos: string[];
  whatsapp: string;
}

export const BARBEIROS: Barbeiro[] = [
  {
    id: "kauan",
    nome: "Kauan",
    foto: kauanImg,
    especialidade: "Cortes clássicos e degradê",
    descricao:
      "Atendimento caprichado e acabamento preciso. Referência em degradê e cortes sociais.",
    servicos: ["Corte", "Pezinho", "Barba", "Corte + Barba"],
    whatsapp: "15997451750",
  },
  {
    id: "ryan",
    nome: "Ryan",
    foto: ryanImg,
    especialidade: "Coloração, luzes e platinado",
    descricao:
      "Especialista em transformações: luzes, platinado e pigmentação com resultado natural.",
    servicos: ["Corte", "Barba", "Luzes", "Platinado", "Pigmentação"],
    whatsapp: "15991566902",
  },
];

export interface Trabalho {
  src: string;
  nome: string;
  categoria: Exclude<Categoria, "outros"> | "outros";
  profissional: string;
}

export const TRABALHOS: Trabalho[] = [
  { src: corte1, nome: "Degradê navalhado", categoria: "cortes", profissional: "Kauan" },
  { src: corte2, nome: "Corte social", categoria: "cortes", profissional: "Kauan" },
  { src: corte3, nome: "Corte + Barba", categoria: "combos", profissional: "Ryan" },
  { src: corte4, nome: "Barba desenhada", categoria: "barba", profissional: "Ryan" },
  { src: corte5, nome: "Low fade", categoria: "cortes", profissional: "Kauan" },
  { src: corte6, nome: "Platinado", categoria: "outros", profissional: "Ryan" },
  { src: corte7, nome: "Corte + Barba", categoria: "combos", profissional: "Kauan" },
  { src: corte8, nome: "Mid fade", categoria: "cortes", profissional: "Ryan" },
  { src: corte9, nome: "Barba alinhada", categoria: "barba", profissional: "Kauan" },
  { src: corte10, nome: "Luzes", categoria: "outros", profissional: "Ryan" },
  { src: corte11, nome: "Corte com pigmentação", categoria: "cortes", profissional: "Kauan" },
  { src: corte12, nome: "Combo completo", categoria: "combos", profissional: "Ryan" },
  { src: corte13, nome: "Degradê alto", categoria: "cortes", profissional: "Kauan" },
];

export const CONTATO = {
  whatsappPrincipal: "15991566902",
  telefone: "(15) 99156-6902",
  endereco:
    "Rua Maria Eunice Bertola Gaioto, 223 - Residencial Bertola, Tietê - SP",
  mapsQuery:
    "Rua Maria Eunice Bertola Gaioto 223 Residencial Bertola Tiete SP",
  instagram: "https://www.instagram.com/",
  horarios: [
    { dia: "Terça a Sexta", hora: "14h às 19h" },
    { dia: "Sábado", hora: "08h às 19h" },
    { dia: "Domingo e Segunda", hora: "Fechado" },
  ],
};

export const whatsappLink = (numero: string, texto: string) =>
  `https://wa.me/${numero.length <= 11 ? `55${numero}` : numero}?text=${encodeURIComponent(texto)}`;
