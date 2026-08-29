import { loja } from "@/config/loja";
import type { Campo, Produto } from "@/data/produtos";

export type RespostaCampo = string | string[] | number | undefined;
export type Respostas = Record<string, RespostaCampo>;

/** Monta o link wa.me com a mensagem já escrita. */
export function linkWhatsapp(mensagem: string, numero: string = loja.whatsapp) {
  const digitos = numero.replace(/\D/g, "");
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensagem)}`;
}

function valorLegivel(campo: Campo, valor: RespostaCampo): string | null {
  if (valor === undefined || valor === "" ) return null;

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

/**
 * Transforma as escolhas do modal numa mensagem organizada.
 * O `*texto*` vira negrito no WhatsApp.
 */
export function mensagemPedido(produto: Produto, respostas: Respostas): string {
  const linhas: string[] = [];

  linhas.push(`Oi, ${loja.confeiteira}! Vim pelo site da ${loja.nome} 🩷`);
  linhas.push("");
  linhas.push(`Queria encomendar: *${produto.nome}*`);

  for (const campo of produto.campos) {
    const texto = valorLegivel(campo, respostas[campo.id]);
    if (texto) linhas.push(`• ${campo.rotulo}: ${texto}`);
  }

  linhas.push("");
  linhas.push("Consegue me passar o valor e a disponibilidade?");

  return linhas.join("\n");
}

/** Checa se todos os campos obrigatórios foram preenchidos. */
export function camposFaltando(produto: Produto, respostas: Respostas): string[] {
  return produto.campos
    .filter((campo) => {
      if (campo.tipo === "quantidade") return false;
      if (!campo.obrigatorio) return false;
      const valor = respostas[campo.id];
      if (campo.tipo === "multi") return !Array.isArray(valor) || valor.length === 0;
      return !valor;
    })
    .map((campo) => campo.rotulo);
}
