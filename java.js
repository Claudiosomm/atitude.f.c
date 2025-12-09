/* =======================================
   LIGHTBOX COM NAVEGAÇÃO
======================================= */

const imagens = document.querySelectorAll('.foto-galeria');
let indiceAtual = 0;

// Criar lightbox
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';

const imgGrande = document.createElement('img');
imgGrande.id = "lightbox-img";

// Botões
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
   MANTER ESCUDO VISÍVEL
======================================= */

window.addEventListener('resize', () => {
    const escudo = document.querySelector('.escudo-box img');
    if (escudo) {
        escudo.style.display = 'block';
        escudo.style.width = '100%';
    }
});

/* =======================================
   CARTAS DOS JOGADORES – VIRAR NO CLIQUE
======================================= */

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("virado");
        });
    });
});
