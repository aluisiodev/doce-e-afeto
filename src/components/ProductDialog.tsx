import { useEffect, useMemo, useState, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Maximize2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import BotaoWhatsapp from "@/components/BotaoWhatsapp";
import type { Campo, Produto } from "@/data/produtos";
import {
  OPCOES_ENTREGA,
  camposFaltando,
  linkWhatsapp,
  mensagemPedido,
  type Respostas,
} from "@/lib/whatsapp";

interface ProductDialogProps {
  produto: Produto | null;
  onClose: () => void;
}

function respostasIniciais(produto: Produto): Respostas {
  const iniciais: Respostas = {};
  for (const campo of produto.campos) {
    if (campo.tipo === "quantidade") {
      iniciais[campo.id] = campo.padrao ?? campo.min;
    } else if (campo.tipo === "multi") {
      iniciais[campo.id] = [];
    } else {
      iniciais[campo.id] = "";
    }
  }
  return iniciais;
}

const ProductDialog = ({ produto, onClose }: ProductDialogProps) => {
  const [respostas, setRespostas] = useState<Respostas>(() =>
    produto ? respostasIniciais(produto) : {}
  );
  const [observacao, setObservacao] = useState("");
  const [formaRecebimento, setFormaRecebimento] = useState<string>("");
  const [imagemAtual, setImagemAtual] = useState(0);

  // Estado do modal de Zoom / Lightbox
  const [lightboxAberto, setLightboxAberto] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const zoomLevelRef = useRef(1);
  zoomLevelRef.current = zoomLevel;

  const [posicao, setPosicao] = useState({ x: 0, y: 0 });
  const posicaoRef = useRef({ x: 0, y: 0 });
  posicaoRef.current = posicao;

  const [arrastando, setArrastando] = useState(false);
  const arrastRef = useRef(false);

  // Refs para controle de toque, duplo clique e arrasto
  const containerImagemRef = useRef<HTMLDivElement>(null);
  const pontoInicial = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const ultimoToqueRef = useRef<{ tempo: number; x: number; y: number }>({ tempo: 0, x: 0, y: 0 });
  const touchDistInicialRef = useRef<number | null>(null);
  const zoomInicialTouchRef = useRef<number>(1);
  const movendoDedoRef = useRef(false);
  const ignoreNextTouchMoveRef = useRef(false);

  // Bloqueia rolagem do body quando o lightbox estiver aberto
  useEffect(() => {
    if (lightboxAberto) {
      const scrollOriginal = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = scrollOriginal;
      };
    }
  }, [lightboxAberto]);

  // Listener nativo com { passive: false } para wheel dentro do lightbox
  // evitando que a página ao fundo role no PC
  useEffect(() => {
    if (!lightboxAberto) return;
    const container = containerImagemRef.current;
    if (!container) return;

    const onWheelNativo = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY < 0) {
        aumentarZoom();
      } else {
        diminuirZoom();
      }
    };

    // Listeners nativos de touch com { passive: false } para garantir
    // que preventDefault() funcione em todos os browsers mobile
    const onTouchStartNativo = (e: TouchEvent) => {
      // Se o toque foi em um botão ou elemento interativo (como as setas de anterior/próxima), não intercepta
      const target = e.target as HTMLElement | null;
      if (target && target.closest("button")) {
        return;
      }

      e.preventDefault();

      if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        touchDistInicialRef.current = dist;
        zoomInicialTouchRef.current = zoomLevelRef.current;
      } else if (e.touches.length === 1) {
        const now = Date.now();
        const touch = e.touches[0];
        const last = ultimoToqueRef.current;
        const delta = now - last.tempo;
        const distTouch = Math.hypot(touch.clientX - last.x, touch.clientY - last.y);

        movendoDedoRef.current = false;

        // Toque duplo: intervalo entre 40ms e 350ms e distância < 30px
        if (delta > 40 && delta < 350 && distTouch < 30) {
          alternarZoomDuploClique(touch.clientX, touch.clientY);
          ignoreNextTouchMoveRef.current = true;
          ultimoToqueRef.current = { tempo: 0, x: 0, y: 0 };
          return;
        }

        ultimoToqueRef.current = { tempo: now, x: touch.clientX, y: touch.clientY };

        if (zoomLevelRef.current > 1) {
          arrastRef.current = true;
          pontoInicial.current = {
            x: touch.clientX,
            y: touch.clientY,
            posX: posicaoRef.current.x,
            posY: posicaoRef.current.y,
          };
        }
      }
    };

    const onTouchMoveNativo = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest("button")) {
        return;
      }

      e.preventDefault();

      if (ignoreNextTouchMoveRef.current) {
        ignoreNextTouchMoveRef.current = false;
        return;
      }
      movendoDedoRef.current = true;
      if (e.touches.length === 2 && touchDistInicialRef.current !== null) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        const ratio = dist / touchDistInicialRef.current;
        const novoZoom = Math.min(Math.max(zoomInicialTouchRef.current * ratio, 1), 4);
        setZoomLevel(novoZoom);
        zoomLevelRef.current = novoZoom;
        if (novoZoom <= 1.05) {
          setPosicao({ x: 0, y: 0 });
        }
      } else if (e.touches.length === 1 && arrastRef.current && zoomLevelRef.current > 1) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - pontoInicial.current.x;
        const deltaY = touch.clientY - pontoInicial.current.y;
        setPosicao({
          x: pontoInicial.current.posX + deltaX,
          y: pontoInicial.current.posY + deltaY,
        });
      }
    };

    const onTouchEndNativo = () => {
      touchDistInicialRef.current = null;
      arrastRef.current = false;
    };

    container.addEventListener("wheel", onWheelNativo, { passive: false });
    container.addEventListener("touchstart", onTouchStartNativo, { passive: false });
    container.addEventListener("touchmove", onTouchMoveNativo, { passive: false });
    container.addEventListener("touchend", onTouchEndNativo);
    return () => {
      container.removeEventListener("wheel", onWheelNativo);
      container.removeEventListener("touchstart", onTouchStartNativo);
      container.removeEventListener("touchmove", onTouchMoveNativo);
      container.removeEventListener("touchend", onTouchEndNativo);
    };
  }, [lightboxAberto]);

  useEffect(() => {
    if (produto) {
      setRespostas(respostasIniciais(produto));
      setObservacao("");
      setFormaRecebimento("");
      setImagemAtual(0);
      setLightboxAberto(false);
      setZoomLevel(1);
      setPosicao({ x: 0, y: 0 });
    }
  }, [produto]);

  // Atalhos de teclado no modo lightbox (Esc, setas, +, -)
  useEffect(() => {
    if (!lightboxAberto) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxAberto(false);
      } else if (e.key === "ArrowLeft") {
        anterior();
      } else if (e.key === "ArrowRight") {
        proxima();
      } else if (e.key === "+" || e.key === "=") {
        aumentarZoom();
      } else if (e.key === "-") {
        diminuirZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxAberto, produto]);

  // Reseta nível de zoom e posição ao trocar de foto
  const resetZoom = () => {
    setZoomLevel(1);
    setPosicao({ x: 0, y: 0 });
  };

  const aumentarZoom = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3.5));
  };

  const diminuirZoom = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPosicao({ x: 0, y: 0 });
      return next;
    });
  };

  // Alterna zoom com duplo clique: exatamente 200% (2.0) e volta para 100% (1.0)
  const alternarZoomDuploClique = (clientX: number, clientY: number) => {
    if (zoomLevelRef.current > 1.05) {
      // Volta para 100%
      setZoomLevel(1);
      zoomLevelRef.current = 1;
      setPosicao({ x: 0, y: 0 });
    } else {
      const container = containerImagemRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const offsetX = clientX - (rect.left + rect.width / 2);
        const offsetY = clientY - (rect.top + rect.height / 2);
        setPosicao({
          x: -offsetX,
          y: -offsetY,
        });
      }
      setZoomLevel(2.0); // Exatamente 200% de zoom
      zoomLevelRef.current = 2.0;
    }
  };

  const faltando = useMemo(
    () => (produto ? camposFaltando(produto, respostas, { formaRecebimento }) : []),
    [produto, respostas, formaRecebimento],
  );

  if (!produto) return null;

  const definir = (id: string, valor: Respostas[string]) =>
    setRespostas((atual) => ({ ...atual, [id]: valor }));

  const alternarMulti = (campo: Extract<Campo, { tipo: "multi" }>, opcao: string) => {
    const atuais = (respostas[campo.id] as string[]) ?? [];
    const jaTem = atuais.includes(opcao);
    if (!jaTem && campo.max && atuais.length >= campo.max) return;
    definir(campo.id, jaTem ? atuais.filter((o) => o !== opcao) : [...atuais, opcao]);
  };

  const totalImagens = produto.imagens.length;
  const anterior = () => {
    resetZoom();
    setImagemAtual((i) => (i - 1 + totalImagens) % totalImagens);
  };
  const proxima = () => {
    resetZoom();
    setImagemAtual((i) => (i + 1) % totalImagens);
  };

  const abrirLightbox = () => {
    resetZoom();
    setLightboxAberto(true);
  };

  const fecharLightbox = () => {
    setLightboxAberto(false);
    resetZoom();
  };

  // Arrastar com Mouse quando estiver com zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevelRef.current <= 1) return;
    setArrastando(true);
    pontoInicial.current = {
      x: e.clientX,
      y: e.clientY,
      posX: posicaoRef.current.x,
      posY: posicaoRef.current.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!arrastando || zoomLevelRef.current <= 1) return;
    const deltaX = e.clientX - pontoInicial.current.x;
    const deltaY = e.clientY - pontoInicial.current.y;
    setPosicao({
      x: pontoInicial.current.posX + deltaX,
      y: pontoInicial.current.posY + deltaY,
    });
  };

  const handleMouseUp = () => setArrastando(false);

  const pronto = faltando.length === 0;
  const link = linkWhatsapp(
    mensagemPedido(produto, respostas, { observacao, formaRecebimento })
  );

  return (
    <>
      <Dialog open={!lightboxAberto} onOpenChange={(aberto) => !aberto && onClose()}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader className="text-left">
            <DialogTitle className="font-display text-2xl">{produto.nome}</DialogTitle>
            <DialogDescription>
              {produto.descricaoLonga ?? produto.descricao}
            </DialogDescription>
          </DialogHeader>

          {/* Galeria */}
          <div className="relative">
            <div
              onClick={abrirLightbox}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && abrirLightbox()}
              title="Clique para ampliar a foto"
              className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-lg bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <img
                src={produto.imagens[imagemAtual]}
                alt={`${produto.nome} — foto ${imagemAtual + 1} de ${totalImagens}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm shadow-sm transition-opacity group-hover:bg-background">
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Clique para ampliar</span>
              </div>
            </div>

            {totalImagens > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    anterior();
                  }}
                  aria-label="Foto anterior"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/85 p-2 shadow transition-colors hover:bg-background"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    proxima();
                  }}
                  aria-label="Próxima foto"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/85 p-2 shadow transition-colors hover:bg-background"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="mt-3 flex justify-center gap-2">
                  {produto.imagens.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImagemAtual(i)}
                      aria-label={`Ver foto ${i + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        i === imagemAtual ? "w-5 bg-primary" : "w-2 bg-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {produto.preco && (
            <p className="font-body text-sm text-muted-foreground">
              Valor <span className="font-semibold text-foreground">{produto.preco}</span>. O
              preço final depende do tamanho e da decoração — a Ana confirma tudo no WhatsApp.
            </p>
          )}

          {/* Opções */}
          <div className="grid gap-5">
            {produto.campos.map((campo) => {
              const idCampo = `campo-${produto.id}-${campo.id}`;

              if (campo.tipo === "quantidade") {
                const valor = Number(respostas[campo.id] ?? campo.min);
                const passo = campo.passo ?? 1;
                return (
                  <div key={campo.id} className="grid gap-2">
                    <Label htmlFor={idCampo}>{campo.rotulo}</Label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => definir(campo.id, Math.max(campo.min, valor - passo))}
                        disabled={valor <= campo.min}
                        aria-label="Diminuir quantidade"
                        className="flex h-10 w-10 items-center justify-center rounded-md border border-input transition-colors hover:bg-muted disabled:opacity-40"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <output
                        id={idCampo}
                        className="min-w-[7rem] text-center font-body font-semibold"
                      >
                        {valor} {valor === 1 ? campo.unidade[0] : campo.unidade[1]}
                      </output>
                      <button
                        type="button"
                        onClick={() => definir(campo.id, Math.min(campo.max, valor + passo))}
                        disabled={valor >= campo.max}
                        aria-label="Aumentar quantidade"
                        className="flex h-10 w-10 items-center justify-center rounded-md border border-input transition-colors hover:bg-muted disabled:opacity-40"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              }

              if (campo.tipo === "select") {
                return (
                  <div key={campo.id} className="grid gap-2">
                    <Label htmlFor={idCampo}>
                      {campo.rotulo}
                      {campo.obrigatorio && <span className="ml-1 text-primary">*</span>}
                    </Label>
                    <Select
                      value={(respostas[campo.id] as string) || undefined}
                      onValueChange={(v) => definir(campo.id, v)}
                    >
                      <SelectTrigger id={idCampo}>
                        <SelectValue placeholder={campo.placeholder ?? "Selecione"} />
                      </SelectTrigger>
                      <SelectContent>
                        {campo.opcoes.map((opcao) => (
                          <SelectItem key={opcao} value={opcao}>
                            {opcao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              }

              if (campo.tipo === "multi") {
                const marcados = (respostas[campo.id] as string[]) ?? [];
                const noLimite = campo.max ? marcados.length >= campo.max : false;
                return (
                  <fieldset key={campo.id} className="grid gap-2">
                    <legend className="mb-2 font-body text-sm font-medium leading-none">
                      {campo.rotulo}
                      {campo.obrigatorio && <span className="ml-1 text-primary">*</span>}
                    </legend>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {campo.opcoes.map((opcao) => {
                        const marcado = marcados.includes(opcao);
                        const idOpcao = `${idCampo}-${opcao}`;
                        return (
                          <div key={opcao} className="flex items-center gap-2.5">
                            <Checkbox
                              id={idOpcao}
                              checked={marcado}
                              disabled={!marcado && noLimite}
                              onCheckedChange={() => alternarMulti(campo, opcao)}
                            />
                            <Label
                              htmlFor={idOpcao}
                              className={`cursor-pointer font-normal ${
                                !marcado && noLimite ? "text-muted-foreground/50" : ""
                              }`}
                            >
                              {opcao}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              }

              return (
                <div key={campo.id} className="grid gap-2">
                  <Label htmlFor={idCampo}>
                    {campo.rotulo}
                    {campo.obrigatorio && <span className="ml-1 text-primary">*</span>}
                  </Label>
                  <Input
                    id={idCampo}
                    value={(respostas[campo.id] as string) ?? ""}
                    placeholder={campo.placeholder}
                    onChange={(e) => definir(campo.id, e.target.value)}
                  />
                </div>
              );
            })}

            {/* Como prefere receber? */}
            <div className="grid gap-2.5 pt-1">
              <Label className="font-body text-sm font-medium leading-none">
                Como prefere receber?
                <span className="ml-1 text-primary">*</span>
              </Label>
              <RadioGroup
                value={formaRecebimento}
                onValueChange={setFormaRecebimento}
                className="gap-2.5"
              >
                {OPCOES_ENTREGA.map((opcao) => {
                  const idOpcao = `recebimento-${produto.id}-${opcao}`;
                  return (
                    <div
                      key={opcao}
                      className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                        formaRecebimento === opcao
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value={opcao} id={idOpcao} />
                      <Label
                        htmlFor={idOpcao}
                        className="cursor-pointer font-body text-sm font-normal leading-snug"
                      >
                        {opcao}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>

            {/* Campo de observação padrão para todos os produtos */}
            <div className="grid gap-2 pt-1">
              <div className="flex items-center justify-between">
                <Label htmlFor={`campo-${produto.id}-observacao`}>
                  Observações
                  <span className="ml-1 text-xs font-normal text-muted-foreground">(opcional)</span>
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  {observacao.length}/3000
                </span>
              </div>
              <Textarea
                id={`campo-${produto.id}-observacao`}
                value={observacao}
                maxLength={3000}
                rows={3}
                placeholder="EX: descreva detalhes do pedido, forma de pagamento, duvidas..."
                onChange={(e) => setObservacao(e.target.value)}
                className="resize-none text-sm placeholder:text-muted-foreground/70"
              />
            </div>
          </div>

          {/* Ação */}
          <div className="sticky bottom-0 -mx-6 mt-1 border-t border-border bg-background px-6 pb-1 pt-4">
            <BotaoWhatsapp href={link} desabilitado={!pronto} tamanho="lg">
              Encomendar
            </BotaoWhatsapp>
            <p className="mt-3 text-center font-body text-xs text-muted-foreground">
              {pronto
                ? "Abre o WhatsApp da Ana com o seu pedido já escrito. Nada é cobrado agora."
                : `Falta escolher: ${faltando.join(", ")}.`}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Zoom / Lightbox Fullscreen */}
      {lightboxAberto && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 p-3 sm:p-4 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-hidden"
          onClick={fecharLightbox}
        >
          {/* Barra Superior */}
          <div
            className="flex w-full max-w-5xl items-center justify-between py-2 text-white shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <h3 className="font-display text-base sm:text-lg font-semibold truncate max-w-[200px] sm:max-w-md">
                {produto.nome}
              </h3>
              {totalImagens > 1 && (
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs text-white/90">
                  {imagemAtual + 1} / {totalImagens}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Controles de Zoom */}
              <div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
                <button
                  type="button"
                  onClick={diminuirZoom}
                  disabled={zoomLevel <= 1}
                  title="Diminuir Zoom (-)"
                  className="rounded-full p-1.5 sm:p-2 text-white/80 hover:bg-white/20 hover:text-white disabled:opacity-40 transition-colors"
                >
                  <ZoomOut className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <span className="min-w-[2.5rem] sm:min-w-[3rem] text-center text-xs font-semibold text-white/90">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={aumentarZoom}
                  disabled={zoomLevel >= 3.5}
                  title="Aumentar Zoom (+)"
                  className="rounded-full p-1.5 sm:p-2 text-white/80 hover:bg-white/20 hover:text-white disabled:opacity-40 transition-colors"
                >
                  <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                {zoomLevel > 1 && (
                  <button
                    type="button"
                    onClick={resetZoom}
                    title="Restaurar tamanho original"
                    className="rounded-full p-1.5 sm:p-2 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                )}
              </div>

              {/* Botão de Fechar (X) */}
              <button
                type="button"
                onClick={fecharLightbox}
                aria-label="Fechar zoom"
                title="Fechar (Esc)"
                className="rounded-full bg-white/15 p-2 text-white hover:bg-white/30 transition-colors ml-1 sm:ml-2"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>

          {/* Dica discreta do duplo clique */}
          <div className="text-center text-[11px] sm:text-xs text-white/60 pointer-events-none shrink-0 py-0.5">
            {zoomLevel > 1
              ? "Dê 2 toques para voltar aos 100% ou arraste para mover"
              : "Dê 2 toques na foto para 200% de zoom"}
          </div>

          {/* Área da imagem com suporte a duplo clique, zoom e arrasto */}
          <div
            ref={containerImagemRef}
            className="relative flex flex-1 w-full max-w-5xl items-center justify-center overflow-hidden my-1 touch-none"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={(e) => alternarZoomDuploClique(e.clientX, e.clientY)}
          >
            <div
              className="flex items-center justify-center max-h-[70vh] max-w-full transition-transform duration-200 ease-out will-change-transform"
              style={{
                transform: `scale(${zoomLevel}) translate(${posicao.x / zoomLevel}px, ${posicao.y / zoomLevel}px)`,
                cursor: zoomLevel > 1 ? (arrastando ? "grabbing" : "grab") : "zoom-in",
              }}
            >
              <img
                src={produto.imagens[imagemAtual]}
                alt={`${produto.nome} — ampliada`}
                className="max-h-[70vh] max-w-full rounded-md object-contain shadow-2xl pointer-events-none select-none"
                draggable={false}
              />
            </div>

            {/* Setas para passar para o lado na tela de zoom */}
            {totalImagens > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    anterior();
                  }}
                  aria-label="Foto anterior"
                  title="Foto anterior (Seta esquerda)"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/60 p-2.5 sm:p-3 text-white hover:bg-black/90 hover:scale-110 active:scale-95 shadow-lg backdrop-blur-sm transition-all"
                >
                  <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    proxima();
                  }}
                  aria-label="Próxima foto"
                  title="Próxima foto (Seta direita)"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/60 p-2.5 sm:p-3 text-white hover:bg-black/90 hover:scale-110 active:scale-95 shadow-lg backdrop-blur-sm transition-all"
                >
                  <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
                </button>
              </>
            )}
          </div>

          {/* Miniaturas no rodapé */}
          <div
            className="flex items-center justify-center gap-2.5 py-1 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {totalImagens > 1 &&
              produto.imagens.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    resetZoom();
                    setImagemAtual(i);
                  }}
                  className={`h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-md border-2 transition-all ${
                    i === imagemAtual
                      ? "border-primary scale-105 shadow-md"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Miniatura ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDialog;
