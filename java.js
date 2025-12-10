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


/* ======================================================
   FLIP DOS JOGADORES (PC = hover / CELULAR = clique)
====================================================== */

// Detecta celular
function isMobile() {
    return window.innerWidth <= 768;
}

// Configura o flip
function setupFlip() {
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        // Evita duplicar listeners
        if (card.__flipInitialized) return;
        card.__flipInitialized = true;

        // PC → hover
        card.addEventListener("mouseenter", () => {
            if (!isMobile()) card.classList.add("virado");
        });

        card.addEventListener("mouseleave", () => {
            if (!isMobile()) card.classList.remove("virado");
        });

        // Celular → clique
        card.addEventListener("click", function (e) {
            if (!isMobile()) return;

            const jaVirado = this.classList.contains("virado");

            // Desvirar todos antes
            document.querySelectorAll(".card.virado").forEach(c => {
                if (c !== this) c.classList.remove("virado");
            });

            // Alternar o atual
            if (jaVirado) this.classList.remove("virado");
            else this.classList.add("virado");

            e.stopPropagation();
        });
    });

    // Clique fora → desvirar tudo no celular
    document.addEventListener('click', function (e) {
        if (!isMobile()) return;

        if (!e.target.closest('.card')) {
            document.querySelectorAll(".card.virado")
                .forEach(c => c.classList.remove("virado"));
        }
    });
}


/* =======================================
   CÁLCULO AUTOMÁTICO DE IDADE
======================================= */
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
    document.querySelectorAll('.idade[data-nasc]').forEach(span => {
        const data = span.getAttribute('data-nasc');
        const idade = calcularIdade(data);
        span.textContent = idade || '—';
    });

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


/* =======================================
   INICIALIZAÇÃO
======================================= */
document.addEventListener('DOMContentLoaded', function () {
    setupFlip();
    atualizarIdades();

    // Atualiza automáticamente à meia-noite
    (function scheduleMidnightUpdate() {
        const now = new Date();
        const msUntilMidnight =
            new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;

        setTimeout(function () {
            atualizarIdades();
            scheduleMidnightUpdate();
        }, msUntilMidnight + 1000);
    }());
});

// Reaplica comportamentos ao redimensionar
window.addEventListener('resize', setupFlip);
