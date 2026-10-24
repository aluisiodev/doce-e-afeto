export type TemaData = "padrao" | "natal" | "pascoa";

// Pode ser lido de uma variável de ambiente (VITE_TEMA) ou alterado manualmente aqui
export const TEMA_ATIVO: TemaData = (import.meta.env.VITE_TEMA as TemaData) || "natal";