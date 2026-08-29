export const loja = {
  nome: "Doce & Afeto",
  confeiteira: "Ana Beatriz",

  /**
   * Número do WhatsApp SOMENTE com dígitos, no formato:
   * 55 (país) + DDD + número.
   * Exemplo: (11) 91234-5678  ->  "5511912345678"
   */
  whatsapp: "5511915068813",

  /** Mensagem que já vem escrita quando a pessoa abre o WhatsApp pelo botão geral. */
  saudacaoWhatsapp: "Oi, Ana! Vim pelo site da Doce & Afeto e queria fazer uma encomenda.",

  /** Deixe uma rede como string vazia ("") para ela sumir do site. */
  redes: {
    instagram: "https://instagram.com/doceeafeto_byana/",
    tiktok: "https://tiktok.com/@doceeafeto",
    ifood:
      "https://www.ifood.com.br/delivery/sao-paulo-sp/doce--afeto-bolos-e-doces-barra-funda/8b4deeef-5e81-4e81-8ab3-c73645931d44",
  },

  email: "",

  /** Aparece na seção de contato. Deixe "" para esconder. */
  cidade: "São Paulo, SP",
  entrega: "Entrega e retirada combinadas pelo WhatsApp",

  /** Antecedência mínima para encomendas — aparece no rodapé dos modais. */
  antecedencia: "Encomendas com no mínimo 3 dias de antecedência",
} as const;

export type Loja = typeof loja;
