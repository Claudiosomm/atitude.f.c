/* java.js - Lightbox + Idade automática + Correções gerais
   Cole inteiro no arquivo java.js e inclua: <script src="java.js"></script>
   (ou <script src="java.js" defer></script>)
*/
(function () {
    'use strict';
  
    /* --------------------------
       UTIL helpers
    ---------------------------*/
    function isValidDateString(s) {
      if (!s) return false;
      const d = new Date(s);
      return !Number.isNaN(d.getTime());
    }
  
    function safeQuery(selector) {
      try {
        return document.querySelector(selector);
      } catch (e) {
        return null;
      }
    }
  
    function safeQueryAll(selector) {
      try {
        return Array.from(document.querySelectorAll(selector));
      } catch (e) {
        return [];
      }
    }
  
    /* --------------------------
       LIGHTBOX (cria só se houver imagens)
    ---------------------------*/
    function initLightbox() {
      // seletores que podem conter imagens da galeria (fallbacks)
      const possibleSelectors = [
        '.foto-galeria',        // sua classe original
        '.imagem-container img',
        '.card-front img',
        '.galeria img',
        '.galeria-elenco img'
      ];
  
      // reuni todas as imagens encontradas (sem duplicar)
      const imagensSet = new Set();
      possibleSelectors.forEach(sel => {
        safeQueryAll(sel).forEach(img => imagensSet.add(img));
      });
      const imagens = Array.from(imagensSet);
  
      if (imagens.length === 0) {
        // nada a fazer
        return;
      }
  
      // Criar lightbox (apenas uma vez)
      const lightbox = document.createElement('div');
      lightbox.id = 'lightbox';
      lightbox.style.cssText = [
        'display:none',
        'position:fixed',
        'inset:0',
        'background:rgba(0,0,0,0.9)',
        'z-index:9999',
        'justify-content:center',
        'align-items:center',
        'padding:20px',
        'box-sizing:border-box',
        'cursor:zoom-out'
      ].join(';');
  
      const imgGrande = document.createElement('img');
      imgGrande.id = 'lightbox-img';
      imgGrande.alt = 'ampliada';
      imgGrande.style.maxWidth = '100%';
      imgGrande.style.maxHeight = '100%';
      imgGrande.style.borderRadius = '8px';
      imgGrande.style.boxShadow = '0 12px 40px rgba(0,0,0,0.7)';
  
      // botões Prev / Next
      const btnPrev = document.createElement('button');
      btnPrev.id = 'btn-prev';
      btnPrev.innerHTML = '&#10094;';
      btnPrev.style.cssText = 'position:absolute;left:18px;font-size:38px;background:transparent;color:#fff;border:none;cursor:pointer;';
  
      const btnNext = document.createElement('button');
      btnNext.id = 'btn-next';
      btnNext.innerHTML = '&#10095;';
      btnNext.style.cssText = 'position:absolute;right:18px;font-size:38px;background:transparent;color:#fff;border:none;cursor:pointer;';
  
      lightbox.appendChild(imgGrande);
      lightbox.appendChild(btnPrev);
      lightbox.appendChild(btnNext);
      document.body.appendChild(lightbox);
  
      let indiceAtual = 0;
  
      function mostrarIndice(i) {
        if (i < 0 || i >= imagens.length) return;
        const src = imagens[i].src || imagens[i].dataset.src || imagens[i].getAttribute('src') || '';
        imgGrande.src = src;
        indiceAtual = i;
      }
  
      imagens.forEach((img, index) => {
        // melhora acessibilidade/usuabilidade
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function (e) {
          e.stopPropagation();
          mostrarIndice(index);
          lightbox.style.display = 'flex';
        });
      });
  
      btnNext.addEventListener('click', function (e) {
        e.stopPropagation();
        mostrarIndice((indiceAtual + 1) % imagens.length);
      });
  
      btnPrev.addEventListener('click', function (e) {
        e.stopPropagation();
        mostrarIndice((indiceAtual - 1 + imagens.length) % imagens.length);
      });
  
      // fecha se clicar fora da imagem
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
          lightbox.style.display = 'none';
        }
      });
  
      // teclado: ESC fecha; setas navegam
      document.addEventListener('keydown', function (e) {
        if (lightbox.style.display === 'flex') {
          if (e.key === 'Escape') lightbox.style.display = 'none';
          if (e.key === 'ArrowRight') btnNext.click();
          if (e.key === 'ArrowLeft') btnPrev.click();
        }
      });
    }
  
    /* --------------------------
       Garantir Escudo
    ---------------------------*/
    function garantirEscudo() {
      const escudo = safeQuery('.globo-escudo img');
      if (escudo) {
        // garante exibição; não força tamanho estragando layout
        escudo.style.display = escudo.style.display || 'block';
        // se você quiser forçar largura, descomente abaixo (mas normalmente não é necessário)
        // escudo.style.width = '120px';
      }
    }
  
    /* --------------------------
       IDADES AUTOMÁTICAS
       - suporta:
         1) <span class="idade" data-nasc="YYYY-MM-DD"></span>
         2) estrutura .jogador com <input type="date" class="data-nascimento" value="YYYY-MM-DD">
            e .idade (span) para exibir
    ---------------------------*/
    function calcularIdade(dataNasc) {
      if (!isValidDateString(dataNasc)) return '';
      const hoje = new Date();
      const nasc = new Date(dataNasc);
  
      let idade = hoje.getFullYear() - nasc.getFullYear();
      const mes = hoje.getMonth() - nasc.getMonth();
      if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) {
        idade--;
      }
      return idade;
    }
  
    function atualizarIdades() {
      // 1) spans com data-nasc
      safeQueryAll('.idade[data-nasc]').forEach(span => {
        const data = span.getAttribute('data-nasc');
        const idade = calcularIdade(data);
        span.textContent = (idade === '') ? '—' : String(idade);
      });
  
      // 2) inputs .data-nascimento dentro de .jogador
      safeQueryAll('.jogador').forEach(jogador => {
        const input = jogador.querySelector('input.data-nascimento[type="date"], input.data-nascimento');
        const spanIdade = jogador.querySelector('.idade:not([data-nasc])');
        if (input && spanIdade && input.value) {
          const idade = calcularIdade(input.value);
          spanIdade.textContent = (idade === '') ? '—' : String(idade);
        }
      });
  
      // 3) se houver spans .data-nascimento para mostrar formato da data (opcional)
      safeQueryAll('.data-nascimento[data-nasc]').forEach(el => {
        const data = el.getAttribute('data-nasc');
        if (!isValidDateString(data)) return;
        const d = new Date(data);
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        el.textContent = `${dia}/${mes}/${ano}`;
      });
    }
  
    /* --------------------------
       Inicialização (DOMContentLoaded)
    ---------------------------*/
    document.addEventListener('DOMContentLoaded', function () {
      try {
        initLightbox();
        garantirEscudo();
        atualizarIdades();
  
        // se precisar atualizar idades dinamicamente (ex.: inputs alterados), observe eventos:
        document.addEventListener('change', function (e) {
          if (e.target && e.target.matches && e.target.matches('input.data-nascimento[type="date"], input.data-nascimento')) {
            atualizarIdades();
          }
        });
  
        // opcional: atualizar idades à meia-noite automaticamente (se a página ficar aberta)
        // calcula quantos ms faltam até meia-noite e agenda
        (function scheduleMidnightUpdate() {
          const now = new Date();
          const msUntilMidnight = (new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now);
          setTimeout(function () {
            atualizarIdades();
            // reschedule para o próximo dia
            scheduleMidnightUpdate();
          }, msUntilMidnight + 1000);
        }());
  
      } catch (err) {
        // fail-safe: log no console (não quebra o resto do site)
        // console.error('Erro inicializando scripts:', err);
      }
    });
  
    /* --------------------------
       Pequena correção de resize para compatibilidade com navegadores antigos
    ---------------------------*/
    window.addEventListener('resize', function () {
      garantirEscudo();
    });
  
  }());
  
  /* ================================
   VIRAR CARTA ENQUANTO SEGURA
================================ */

document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        // 🟡 VIRAR quando SEGURAR (dedo ou mouse)
        const virar = () => card.classList.add("virado");

        // 🔵 DESVIRAR quando SOLTAR
        const desvirar = () => card.classList.remove("virado");

        // Mouse
        card.addEventListener("mousedown", virar);
        card.addEventListener("mouseup", desvirar);
        card.addEventListener("mouseleave", desvirar);

        // Touch (celular)
        card.addEventListener("touchstart", virar);
        card.addEventListener("touchend", desvirar);
        card.addEventListener("touchcancel", desvirar);
    });
});
