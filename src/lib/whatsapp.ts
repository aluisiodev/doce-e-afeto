import { loja } from "@/config/loja";
import type { Campo, Produto } from "@/data/produtos";

export type RespostaCampo = string | string[] | number | undefined;
export type Respostas = Record<string, RespostaCampo>;

export const OPCOES_ENTREGA = [
  "Retirada na Doce e Afeto (Bairro Bom Retiro)",
  "Consultar disponibilidade de entrega",
] as const;

export type TipoEntrega = (typeof OPCOES_ENTREGA)[number];

export interface OpcoesGeraisPedido {
  observacao?: string;
  formaRecebimento?: string;
}

export interface ItemCarrinho {
  produto: Produto;
  respostas: Respostas;
  observacao?: string;
  formaRecebimento?: string;
}

/** Monta o link wa.me com a mensagem já escrita. */
export function linkWhatsapp(mensagem: string, numero: string = loja.whatsapp) {
  const digitos = numero.replace(/\D/g, "");
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensagem)}`;
}

function valorLegivel(campo: Campo, valor: RespostaCampo): string | null {
  if (valor === undefined || valor === "") return null;

  if (campo.tipo === "quantidade") {
    const n = Number(valor);
    if (!n) return null;
    const [singular, plural] = campo.unidade;
    return `${n} ${n === 1 ? singular : plural}`;
  }

  if (campo.tipo === "multi") {
    const lista = Array.isArray(valor) ? valor : [];
    return lista.length ? lista.join(", ") : null;
  }

  return String(valor).trim() || null;
}

/** Formata as linhas de detalhes/opções de um item */
export function formatarLinhasItem(
  produto: Produto,
  respostas: Respostas,
  opcoes?: OpcoesGeraisPedido
): string[] {
  const linhas: string[] = [];

  for (const campo of produto.campos) {
    const texto = valorLegivel(campo, respostas[campo.id]);
    if (texto) linhas.push(`  • ${campo.rotulo}: ${texto}`);
  }

  const forma = (opcoes?.formaRecebimento ?? (typeof respostas.formaRecebimento === "string" ? respostas.formaRecebimento : "")).trim();
  if (forma) {
    linhas.push(`  • Recebimento: ${forma}`);
  }

  const obs = (opcoes?.observacao ?? (typeof respostas.observacao === "string" ? respostas.observacao : "")).trim();
  if (obs) {
    linhas.push(`  • *Obs:* ${obs}`);
  }

  return linhas;
}

/**
 * Transforma as escolhas do modal numa mensagem organizada de um único pedido.
 * O `*texto*` vira negrito no WhatsApp.
 */
export function mensagemPedido(
  produto: Produto,
  respostas: Respostas,
  opcoes?: string | OpcoesGeraisPedido
): string {
  const obs = typeof opcoes === "string" ? opcoes : opcoes?.observacao;
  const formaRecebimento = typeof opcoes === "object" ? opcoes?.formaRecebimento : undefined;

  const obsFinal = obs ?? (typeof respostas.observacao === "string" ? respostas.observacao : undefined);
  const formaFinal = formaRecebimento ?? (typeof respostas.formaRecebimento === "string" ? respostas.formaRecebimento : undefined);

  const linhas: string[] = [];

  linhas.push(`Oi, ${loja.confeiteira}! Vim pelo site da ${loja.nome}`);
  linhas.push("");
  linhas.push(`Queria encomendar: *${produto.nome}*`);

  for (const campo of produto.campos) {
    const texto = valorLegivel(campo, respostas[campo.id]);
    if (texto) linhas.push(`• ${campo.rotulo}: ${texto}`);
  }

  const formaFormatada = formaFinal?.trim();
  if (formaFormatada) {
    linhas.push(`• Como prefere receber: ${formaFormatada}`);
  }

  const obsFormatada = obsFinal?.trim();
  if (obsFormatada) {
    linhas.push(`• *Observação:* ${obsFormatada}`);
  }

  linhas.push("");
  linhas.push("Consegue me passar o valor e a disponibilidade?");

  return linhas.join("\n");
}

/**
 * Formata múltiplos itens para quando o sistema de carrinho estiver ativo.
 */
export function mensagemCarrinho(itens: ItemCarrinho[], formaRecebimentoGeral?: string): string {
  const linhas: string[] = [];

  linhas.push(`Oi, ${loja.confeiteira}! Vim pelo site da ${loja.nome}`);
  linhas.push("");
  linhas.push(`Queria fazer o pedido dos seguintes itens:`);

  itens.forEach((item, index) => {
    linhas.push("");
    linhas.push(`*${index + 1}. ${item.produto.nome}*`);
    const detalhes = formatarLinhasItem(item.produto, item.respostas, {
      observacao: item.observacao,
      formaRecebimento: formaRecebimentoGeral ? undefined : item.formaRecebimento,
    });
    linhas.push(...detalhes);
  });

  if (formaRecebimentoGeral?.trim()) {
    linhas.push("");
    linhas.push(`• *Como prefere receber:* ${formaRecebimentoGeral.trim()}`);
  }

  linhas.push("");
  linhas.push("Consegue me passar o valor total e a disponibilidade?");

  return linhas.join("\n");
}

/** Checa se todos os campos obrigatórios foram preenchidos. */
export function camposFaltando(
  produto: Produto,
  respostas: Respostas,
  opcoes?: { formaRecebimento?: string }
): string[] {
  const faltando = produto.campos
    .filter((campo) => {
      if (campo.tipo === "quantidade") return false;
      if (!campo.obrigatorio) return false;
      const valor = respostas[campo.id];
      if (campo.tipo === "multi") return !Array.isArray(valor) || valor.length === 0;
      return !valor;
    })
    .map((campo) => campo.rotulo);

  if (opcoes && !opcoes.formaRecebimento) {
    faltando.push("Como prefere receber");
  }

  return faltando;
}
