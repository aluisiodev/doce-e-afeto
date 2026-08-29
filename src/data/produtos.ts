/**
 * ============================================================
 *  CATÁLOGO DE PRODUTOS — EDITE ESTE ARQUIVO
 * ============================================================
 *
 * Cada produto vira um card na página /produtos. Ao clicar no card,
 * abre um modal com as opções definidas em `campos`.
 *
 * Tipos de campo disponíveis:
 *   - "quantidade": seletor de número (+ / -)
 *   - "select":     escolha única (ex.: tamanho, sabor)
 *   - "multi":      escolha múltipla com caixinhas (ex.: até 3 sabores)
 *   - "texto":      campo livre (ex.: tema da festa, nome no bolo)
 *
 * Para adicionar uma foto nova: coloque o arquivo em `src/assets/`,
 * importe no topo deste arquivo e use no array `imagens`.
 */

import boloChocolate from "@/assets/bolo-1.png";
import boloMorango from "@/assets/bolo-2.png";
import boloDecorado from "@/assets/bolo-3.png";
import trufas from "@/assets/trufas.png";
import brigadeiro from "@/assets/product-brigadeiro.jpg";
import beijinho from "@/assets/product-beijinho.jpg";
import cupcake from "@/assets/product-cupcake.jpg";
import cajuzinho from "@/assets/product-cajuzinho.jpg";

export type Campo =
  | {
      id: string;
      tipo: "quantidade";
      rotulo: string;
      min: number;
      max: number;
      passo?: number;
      /** Ex.: "bolo" / "bolos". Usado no texto do WhatsApp. */
      unidade: [singular: string, plural: string];
      padrao?: number;
    }
  | {
      id: string;
      tipo: "select";
      rotulo: string;
      opcoes: string[];
      placeholder?: string;
      obrigatorio?: boolean;
      ajuda?: string;
    }
  | {
      id: string;
      tipo: "multi";
      rotulo: string;
      opcoes: string[];
      max?: number;
      obrigatorio?: boolean;
      ajuda?: string;
    }
  | {
      id: string;
      tipo: "texto";
      rotulo: string;
      placeholder?: string;
      obrigatorio?: boolean;
      ajuda?: string;
    };

export interface Produto {
  id: string;
  nome: string;
  /** Frase curta no card. */
  descricao: string;
  /** Texto maior dentro do modal. */
  descricaoLonga?: string;
  /** Ex.: "a partir de R$ 90" — deixe de fora se preferir não mostrar preço. */
  preco?: string;
  categoria: "Bolos" | "Doces de festa" | "Presentes";
  imagens: string[];
  campos: Campo[];
}

const SABORES_BOLO = [
  "Chocolate",
  "Ninho com Nutella",
  "Morango com chantilly",
  "Prestígio",
  "Red velvet",
  "Cenoura com chocolate",
  "Limão siciliano",
];

const SABORES_DOCINHO = [
  "Brigadeiro tradicional",
  "Beijinho",
  "Cajuzinho",
  "Brigadeiro branco",
  "Ninho com Nutella",
  "Churros",
  "Maracujá",
  "Paçoca",
];

export const produtos: Produto[] = [
  {
    id: "bolos",
    nome: "Bolos",
    descricao: "Bolos artesanais decorados, do tamanho e sabor que você escolher.",
    descricaoLonga:
      "Massa fofinha, recheio generoso e decoração feita à mão. Dá para combinar tema, cores e mensagem no topo.",
    preco: "a partir de R$ 90",
    categoria: "Bolos",
    imagens: [boloChocolate, boloMorango, boloDecorado],
    campos: [
      {
        id: "tamanho",
        tipo: "select",
        rotulo: "Tamanho",
        obrigatorio: true,
        placeholder: "Para quantas pessoas?",
        opcoes: [
          "Pequeno — serve até 10 pessoas",
          "Médio — serve até 20 pessoas",
          "Grande — serve até 35 pessoas",
          "Dois andares — serve 50+ pessoas",
        ],
      },
      {
        id: "sabor",
        tipo: "select",
        rotulo: "Sabor",
        obrigatorio: true,
        placeholder: "Escolha o sabor",
        opcoes: SABORES_BOLO,
      },
      {
        id: "quantidade",
        tipo: "quantidade",
        rotulo: "Quantidade",
        min: 1,
        max: 10,
        unidade: ["bolo", "bolos"],
      },
      {
        id: "personalizacao",
        tipo: "select",
        rotulo: "Decoração",
        obrigatorio: true,
        placeholder: "Como você quer a decoração?",
        opcoes: [
          "Decoração simples",
          "Decoração personalizada (tema, cores, topo)",
        ],
      },
      {
        id: "tema",
        tipo: "texto",
        rotulo: "Tema, cores ou mensagem",
        placeholder: "Ex.: aniversário de 15 anos, tons de lilás, escrito “Parabéns, Duda”",
        ajuda: "Opcional — se quiser, mande uma foto de referência direto no WhatsApp.",
      },
      {
        id: "data",
        tipo: "texto",
        rotulo: "Data da entrega",
        placeholder: "Ex.: 14/09, à tarde",
      },
    ],
  },
  {
    id: "trufas",
    nome: "Trufas",
    descricao: "Trufas finas de casca crocante, feitas à mão uma a uma.",
    descricaoLonga:
      "Vendidas em caixas fechadas ou avulsas. Ótimas para presentear ou vender.",
    preco: "a partir de R$ 4,50 a unidade",
    categoria: "Presentes",
    imagens: [trufas],
    campos: [
      {
        id: "quantidade",
        tipo: "quantidade",
        rotulo: "Quantidade",
        min: 6,
        max: 200,
        passo: 6,
        padrao: 12,
        unidade: ["trufa", "trufas"],
      },
      {
        id: "sabores",
        tipo: "multi",
        rotulo: "Sabores",
        obrigatorio: true,
        max: 4,
        ajuda: "Escolha até 4 sabores — a Ana divide a quantidade entre eles.",
        opcoes: [
          "Chocolate ao leite",
          "Chocolate branco",
          "Maracujá",
          "Morango",
          "Nozes",
          "Pistache",
          "Café",
          "Limão",
        ],
      },
      {
        id: "embalagem",
        tipo: "select",
        rotulo: "Embalagem",
        placeholder: "Como você quer receber?",
        opcoes: ["Caixa de presente", "Saquinho individual", "Bandeja simples"],
      },
      {
        id: "data",
        tipo: "texto",
        rotulo: "Data da entrega",
        placeholder: "Ex.: 14/09, à tarde",
      },
    ],
  },
  {
    id: "brigadeiros",
    nome: "Brigadeiros gourmet",
    descricao: "O clássico da festa, com chocolate de verdade e ponto certinho.",
    preco: "a partir de R$ 2,50 a unidade",
    categoria: "Doces de festa",
    imagens: [brigadeiro],
    campos: [
      {
        id: "quantidade",
        tipo: "quantidade",
        rotulo: "Quantidade",
        min: 25,
        max: 500,
        passo: 25,
        padrao: 50,
        unidade: ["brigadeiro", "brigadeiros"],
      },
      {
        id: "sabores",
        tipo: "multi",
        rotulo: "Sabores",
        obrigatorio: true,
        max: 3,
        ajuda: "Escolha até 3 sabores.",
        opcoes: SABORES_DOCINHO,
      },
      {
        id: "data",
        tipo: "texto",
        rotulo: "Data da festa",
        placeholder: "Ex.: 14/09, à tarde",
      },
    ],
  },
  {
    id: "beijinhos",
    nome: "Beijinhos",
    descricao: "Coco fresco, leite condensado e cravo por cima. Simples e perfeito.",
    preco: "a partir de R$ 2,50 a unidade",
    categoria: "Doces de festa",
    imagens: [beijinho],
    campos: [
      {
        id: "quantidade",
        tipo: "quantidade",
        rotulo: "Quantidade",
        min: 25,
        max: 500,
        passo: 25,
        padrao: 50,
        unidade: ["beijinho", "beijinhos"],
      },
      {
        id: "acabamento",
        tipo: "select",
        rotulo: "Acabamento",
        placeholder: "Escolha o acabamento",
        opcoes: ["Coco ralado", "Açúcar cristal", "Cravo tradicional"],
      },
      {
        id: "data",
        tipo: "texto",
        rotulo: "Data da festa",
        placeholder: "Ex.: 14/09, à tarde",
      },
    ],
  },
  {
    id: "cajuzinhos",
    nome: "Cajuzinhos",
    descricao: "Amendoim torrado na hora, com aquele açúcar cristal por fora.",
    preco: "a partir de R$ 2,50 a unidade",
    categoria: "Doces de festa",
    imagens: [cajuzinho],
    campos: [
      {
        id: "quantidade",
        tipo: "quantidade",
        rotulo: "Quantidade",
        min: 25,
        max: 500,
        passo: 25,
        padrao: 50,
        unidade: ["cajuzinho", "cajuzinhos"],
      },
      {
        id: "data",
        tipo: "texto",
        rotulo: "Data da festa",
        placeholder: "Ex.: 14/09, à tarde",
      },
    ],
  },
  {
    id: "cupcakes",
    nome: "Cupcakes",
    descricao: "Bolinhos individuais com cobertura em bico e confeitos.",
    preco: "a partir de R$ 8 a unidade",
    categoria: "Doces de festa",
    imagens: [cupcake],
    campos: [
      {
        id: "quantidade",
        tipo: "quantidade",
        rotulo: "Quantidade",
        min: 6,
        max: 120,
        passo: 6,
        padrao: 12,
        unidade: ["cupcake", "cupcakes"],
      },
      {
        id: "sabor",
        tipo: "select",
        rotulo: "Sabor da massa",
        obrigatorio: true,
        placeholder: "Escolha o sabor",
        opcoes: ["Baunilha", "Chocolate", "Red velvet", "Cenoura", "Limão"],
      },
      {
        id: "cobertura",
        tipo: "select",
        rotulo: "Cobertura",
        placeholder: "Escolha a cobertura",
        opcoes: ["Chantilly", "Ganache", "Buttercream colorido", "Cream cheese"],
      },
      {
        id: "tema",
        tipo: "texto",
        rotulo: "Cores ou tema",
        placeholder: "Ex.: azul e dourado, tema futebol",
      },
      {
        id: "data",
        tipo: "texto",
        rotulo: "Data da entrega",
        placeholder: "Ex.: 14/09, à tarde",
      },
    ],
  },
];

export const categorias = ["Todos", "Bolos", "Doces de festa", "Presentes"] as const;
export type Categoria = (typeof categorias)[number];
