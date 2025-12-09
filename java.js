/* =======================================
   LIGHTBOX COM NAVEGAÇÃO
======================================= */
const imagens = document.querySelectorAll('.foto-galeria');
let indiceAtual = 0;

const lightbox = document.createElement('div');
lightbox.id = 'lightbox';

const imgGrande = document.createElement('img');
imgGrande.id = "lightbox-img";

const btnPrev = document.createElement('div');
btnPrev.id = "btn-prev";
btnPrev.classList.add("lightbox-btn");
btnPrev.innerHTML = "&#10094;";

const btnNext = document.createElement('div');
btnNext.id = "btn-next";
btnNext.classList.add("lightbox-btn");
btnNext.innerHTML = "&#10095;";

lightbox.appendChild(imgGrande);
lightbox.appendChild(btnPrev);
lightbox.appendChild(btnNext);
document.body.appendChild(lightbox);

imagens.forEach((img, index) => {
    img.addEventListener('click', () => {
        indiceAtual = index;
        mostrarImagem();
        lightbox.classList.add('ativo');
    });
});

function mostrarImagem() {
    imgGrande.src = imagens[indiceAtual].src;
}

btnNext.addEventListener('click', (e) => {
    e.stopPropagation();
    indiceAtual = (indiceAtual + 1) % imagens.length;
    mostrarImagem();
});

btnPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    indiceAtual = (indiceAtual - 1 + imagens.length) % imagens.length;
    mostrarImagem();
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('ativo');
    }
});

/* =======================================
   FLIP NOS JOGADORES (PC + CELULAR)
======================================= */
const cards = document.querySelectorAll(".jogador-card");

/* PC - hover */
cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
        if (!isMobile()) card.classList.add("virado");
    });
    card.addEventListener("mouseleave", () => {
        if (!isMobile()) card.classList.remove("virado");
    });
});

/* CELULAR - clique */
cards.forEach(card => {
    card.addEventListener("click", () => {
        if (!isMobile()) return;

        const jaVirado = card.classList.contains("virado");

        cards.forEach(c => c.classList.remove("virado"));

        if (!jaVirado) {
            card.classList.add("virado");
        }
    });
});

/* Detecta celular */
function isMobile() {
    return window.innerWidth <= 768;
}

/* Garantir escudo */
window.addEventListener('resize', () => {
    const escudo = document.querySelector('.escudo-box img');
    if (escudo) {
        escudo.style.display = 'block';
        escudo.style.width = '100%';
    }
});
/* ======== Flip no celular sem mexer no CSS ======== */

document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", function () {

        // Se já estiver virada → desvirar
        if (this.classList.contains("flip")) {
            this.classList.remove("flip");
            return;
        }

        // Desvira todas as outras antes de virar a clicada
        document.querySelectorAll(".card.flip").forEach(c => {
            c.classList.remove("flip");
        });

        // Vira a clicada
        this.classList.add("flip");
    });
});

/* flip-age.js - controla flip no celular e calcula idades automaticamente */
(function () {
    'use strict';
  
    function isMobile() {
      return window.innerWidth <= 768;
    }
  
    // --- FLIP behavior ---
    function setupFlip() {
      document.querySelectorAll('.card').forEach(card => {
        // Evita múltiplos listeners
        if (card.__flipInitialized) return;
        card.__flipInitialized = true;
  
        card.addEventListener('click', function (e) {
          // se desktop e hover já cuida, não interferimos (mas click pode ser usado também)
          if (!isMobile()) {
            // optional: allow click to also toggle on desktop if you want
          }
  
          const already = this.classList.contains('virado');
  
          // desvira todos
          document.querySelectorAll('.card.virado').forEach(c => {
            if (c !== this) c.classList.remove('virado');
          });
  
          // toggle no atual
          if (already) this.classList.remove('virado');
          else this.classList.add('virado');
  
          // evita que clique em elementos internos dispare ações externas
          e.stopPropagation();
        });
      });
  
      // quando tocar fora, desvira tudo (bom UX)
      document.addEventListener('click', function (e) {
        // se o clique não foi em um card, desvira todos
        if (!e.target.closest('.card')) {
          document.querySelectorAll('.card.virado').forEach(c => c.classList.remove('virado'));
        }
      });
    }
  
    // --- IDADE automatic update ---
    function isValidDateString(s) {
      if (!s) return false;
      const d = new Date(s);
      return !Number.isNaN(d.getTime());
    }
  
    function calcularIdade(dataNasc) {
      if (!isValidDateString(dataNasc)) return '';
      const hoje = new Date();
      const nasc = new Date(dataNasc);
      let idade = hoje.getFullYear() - nasc.getFullYear();
      const mes = hoje.getMonth() - nasc.getMonth();
      if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) idade--;
      return idade;
    }
  
    function atualizarIdades() {
      // spans com class "idade" e atributo data-nasc
      document.querySelectorAll('.idade[data-nasc]').forEach(span => {
        const data = span.getAttribute('data-nasc');
        const idade = calcularIdade(data);
        span.textContent = (idade === '') ? '—' : String(idade);
      });
  
      // preencher data formatada (opcional) nas spans data-nascimento
      document.querySelectorAll('.data-nascimento[data-nasc]').forEach(span => {
        const data = span.getAttribute('data-nasc');
        if (!isValidDateString(data)) return;
        const d = new Date(data);
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        span.textContent = `${dia}/${mes}/${ano}`;
      });
    }
  
    // init on DOM ready
    document.addEventListener('DOMContentLoaded', function () {
      setupFlip();
      atualizarIdades();
  
      // atualiza idades à meia-noite (se a página ficar aberta)
      (function scheduleMidnightUpdate() {
        const now = new Date();
        const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1) - now;
        setTimeout(function () {
          atualizarIdades();
          scheduleMidnightUpdate();
        }, msUntilMidnight + 1000);
      }());
    });
  
    // também reinicializa se o usuário redimensionar a tela (troca mobile <> desktop)
    window.addEventListener('resize', function () {
      setupFlip();
    });
  
  }());
  
