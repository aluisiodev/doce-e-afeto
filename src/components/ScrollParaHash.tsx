import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * O React Router não rola até a âncora sozinho. Este componente faz isso
 * quando a URL tem um #hash, e volta ao topo quando não tem.
 */
const ScrollParaHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    const alvo = document.querySelector(hash);
    if (alvo) {
      // Pequeno atraso para a seção já existir na tela.
      requestAnimationFrame(() =>
        alvo.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollParaHash;
